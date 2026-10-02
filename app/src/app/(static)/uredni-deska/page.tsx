import Link from 'next/link'
import { Building2, FileText, Gavel, Inbox, Landmark, MessageSquareWarning, Receipt, Scale } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { accentAt } from '@/components/ui/accent'
import { Accordion, Callout, JumpNav, PersonCard, Section } from '@/components/static/kit'
import { CopyValue } from '@/components/static/copy-value'
import { staticPageMetadata } from '@/components/static/meta'
import { cn } from '@/lib/utils'

export const metadata = staticPageMetadata({
  title: 'Úřední deska',
  description:
    'Povinně zveřejňované informace podle zákona č. 106/1999 Sb.: základní údaje o škole, organizační struktura, žádosti o informace, stížnosti, ceník.',
  path: '/uredni-deska/'
})

const IDENTIFIERS = [
  { label: 'IČ', value: '70 15 73 32' },
  { label: 'IZO', value: '102390967' },
  { label: 'ID datové schránky', value: 'qkjmk82' }
]

const BASICS: { label: string; value: React.ReactNode }[] = [
  { label: 'Název školy', value: 'Základní škola Gutha-Jarkovského Kostelec nad Orlicí' },
  { label: 'Sídlo', value: 'Palackého náměstí 45, 517 41 Kostelec nad Orlicí' },
  { label: 'Právní forma', value: 'příspěvková organizace' },
  { label: 'Spisová značka', value: 'Pr 220 vedená u Krajského soudu v Hradci Králové' },
  { label: 'Zřizovatel', value: 'Město Kostelec nad Orlicí, Palackého náměstí 38, 517 41 Kostelec nad Orlicí' },
  {
    label: 'Telefon a e-mail sídla',
    value: (
      <>
        <a href="tel:+420775598553">775 598 553</a>, <a href="mailto:zsnam@eltec.cz">zsnam@eltec.cz</a>
      </>
    )
  }
]

const WORKPLACES = [
  { address: 'Palackého náměstí 45', what: '2. stupeň, vzdělávání cizinců', phone: '775 598 553' },
  { address: 'Komenského 80', what: '1. stupeň, vzdělávání cizinců' },
  { address: 'Drtinova 662', what: '1. stupeň a školní družina' },
  { address: 'Erbenova 891', what: 'školní družina' }
]

/** Org chart rebuilt from the 2022 image, as real (readable, accessible) HTML. */
const ORG = {
  head: 'Ředitel školy',
  staff: ['Ekonomka, personalistka', 'Sekretářka, administrativní pracovnice', 'Školní poradenské pracoviště + speciální pedagog'],
  branches: [
    { title: 'Vedoucí vychovatelka ŠD Erbenova', children: ['Vychovatelky Erbenova, Drtinova'] },
    {
      title: 'Zástupce ředitele – pracoviště Komenského a Drtinova',
      children: ['Učitelé 1. stupně', 'Školník Komenského', 'Uklízečky Komenského', 'Školník Drtinova', 'Učitel pověřený řízením vzdělávání cizinců']
    },
    { title: 'Zástupce ředitele – pracoviště Náměstí', children: ['Učitelé 2. stupně', 'Školník Náměstí', 'Uklízečky Náměstí'] },
    { title: 'Zástupce ředitele pro prevenci', children: [] }
  ]
}

export default function UredniDeskaPage() {
  return (
    <>
      <PageHero
        title="Úřední deska"
        colorKey="uredni-deska"
        eyebrow="O škole"
        lead="Povinně zveřejňované informace podle zákona č. 106/1999 Sb., o svobodném přístupu k informacím."
      >
        <JumpNav
          items={[
            { href: '#zakladni-udaje', label: 'Základní údaje' },
            { href: '#platby', label: 'Bankovní spojení' },
            { href: '#vedeni', label: 'Vedení a GDPR' },
            { href: '#struktura', label: 'Organizační struktura' },
            { href: '#informace', label: 'Žádosti a stížnosti' }
          ]}
        />
      </PageHero>

      <Section id="zakladni-udaje" eyebrow="Základní údaje" title="Škola v číslech a adresách">
        <ul className="m-0 mb-6 grid list-none gap-4 p-0 sm:grid-cols-3">
          {IDENTIFIERS.map((item, idx) => (
            <li key={item.label} className={cn('sticker flex flex-col gap-1 p-5', accentAt(idx).tint)}>
              <span className="text-sm font-extrabold tracking-wide uppercase">{item.label}</span>
              <CopyValue value={item.value} />
            </li>
          ))}
        </ul>
        <dl className="sticker m-0 grid gap-x-6 p-5 sm:grid-cols-[14rem_1fr] sm:p-6">
          {BASICS.map((row) => (
            <div key={row.label} className="contents">
              <dt className="pt-3 font-bold text-gray-7 first:pt-0 sm:py-2">{row.label}</dt>
              <dd className="m-0 border-b-2 border-ink/10 pb-3 last:border-0 sm:py-2">{row.value}</dd>
            </div>
          ))}
        </dl>
        <h3 className="mt-10 mb-4 font-display text-2xl">Pracoviště školy</h3>
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {WORKPLACES.map((w, idx) => (
            <li key={w.address} className="sticker flex flex-col gap-2 p-5">
              <Building2 className={cn('size-7', accentAt(idx + 1).text)} aria-hidden />
              <span className="font-display text-lg leading-tight font-bold">{w.address}</span>
              <span className="text-gray-7">{w.what}</span>
              {w.phone && (
                <a href={`tel:+420${w.phone.replace(/\s/g, '')}`} className="text-sm font-bold">
                  tel. {w.phone}
                </a>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <Link href="/pracoviste/" className="font-bold">
            Prohlédněte si pracoviště na mapě města →
          </Link>
        </p>
      </Section>

      <Section id="platby" eyebrow="Bankovní spojení" title="Kam posílat platby" tinted accent={accentAt(1)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="sticker flex flex-col gap-2 p-5 sm:p-6">
            <span className="w-fit rounded-full bg-grass-tint px-3 py-0.5 text-sm font-extrabold">Pro rodiče</span>
            <CopyValue value="2500302071/2010" />
            <span className="text-gray-7">Fio banka</span>
            <p className="m-0 text-gray-8">Školní pomůcky, plavání, KRPŠ, školní družina.</p>
          </div>
          <div className="sticker flex flex-col gap-2 p-5 sm:p-6">
            <span className="w-fit rounded-full bg-berry-tint px-3 py-0.5 text-sm font-extrabold">Státní správa a dodavatelé</span>
            <CopyValue value="123-2722210287/0100" />
            <span className="text-gray-7">Komerční banka a.s.</span>
            <p className="m-0 text-gray-8">
              Služby, energie, nákupy… <strong>Neslouží pro platby rodičů.</strong>
            </p>
          </div>
        </div>
        <p className="mt-4 text-gray-7">
          Obědy se platí přímo jídelně – viz <Link href="/skolni-stravovani/">Školní stravování</Link>.
        </p>
      </Section>

      <Section id="vedeni" eyebrow="Kontakty" title="Vedení školy a ochrana osobních údajů">
        <div className="grid gap-4 md:grid-cols-2">
          <PersonCard
            person={{ name: 'Mgr. Jiří Němec', role: 'ředitel školy', phones: ['775606361'], email: 'jiri.nemec@zskostelec.cz' }}
          />
          <PersonCard
            person={{
              name: 'Mgr. Martina Kalousková',
              role: 'pověřenec pro ochranu osobních údajů',
              phones: ['773838404'],
              email: 'martina.kalouskova@zskostelec.cz'
            }}
          />
        </div>
      </Section>

      <Section id="struktura" eyebrow="Organizace" title="Organizační struktura" tinted accent={accentAt(4)}>
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-full border-[2.5px] border-ink bg-sun px-6 py-3 font-display text-xl font-extrabold shadow-pop">
            {ORG.head}
          </div>
          <ul className="m-0 flex list-none flex-wrap justify-center gap-2 p-0">
            {ORG.staff.map((s) => (
              <li key={s} className="rounded-full border-2 border-ink bg-paper px-3 py-1 text-sm font-bold">
                {s}
              </li>
            ))}
          </ul>
          <ul className="m-0 grid w-full list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {ORG.branches.map((b, idx) => (
              <li key={b.title} className="sticker flex flex-col gap-3 p-4">
                <span className={cn('rounded-xl border-2 border-ink px-3 py-2 font-display leading-tight font-bold', accentAt(idx).tint)}>
                  {b.title}
                </span>
                {b.children.length > 0 && (
                  <ul className="m-0 flex list-none flex-col gap-1.5 border-l-[3px] border-ink/15 p-0 pl-3 text-sm">
                    {b.children.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Callout icon={Landmark} accent={accentAt(0)} title="Účel organizace">
            Poskytovat základní vzdělávání podle zákona č. 561/2004 Sb. (školský zákon) – podle § 44 připravovat žáky na další
            studium a praxi v souladu s obecnými cíli vzdělávání podle § 2.
          </Callout>
          <Callout icon={Gavel} accent={accentAt(2)} title="Statutární orgán">
            Statutárním orgánem je ředitel školy. Jedná samostatně ve všech věcech jménem školy v souladu s právními předpisy;
            jeho pravomoci vymezují § 164 a 165 školského zákona.
          </Callout>
        </div>
      </Section>

      <Section id="informace" eyebrow="Pro veřejnost" title="Žádosti, stížnosti a předpisy">
        <Accordion
          items={[
            {
              id: 'zadosti',
              title: (
                <span className="inline-flex items-center gap-2">
                  <Inbox className="size-5" aria-hidden /> Jak požádat o informace
                </span>
              ),
              content: (
                <>
                  <p>
                    U každé žádosti musí být jednoznačně zřejmé, že se žadatel domáhá informace ve smyslu zákona č. 106/1999 Sb.
                    Informace se poskytuje ve formátu a jazyce podle žádosti, nestanoví-li zákon jinak, a ve formátu nebo jazyce,
                    ve kterém byla vytvořena.
                  </p>
                  <p>
                    Žádosti se přijímají na podatelnách v pracovní dny <strong>7:15 – 15:00</strong>. Žadatel uvede jméno a
                    příjmení. Na ústní žádost škola poskytne ústní informaci; pokud nestačí, podá žadatel žádost písemně (lze ji
                    sepsat na podatelně) a doplní telefon nebo adresu pro odpověď.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-sky-tint p-4">
                      <strong>Podatelna</strong>
                      <br />
                      Palackého nám. 45, <a href="tel:+420775598553">775 598 553</a>
                      <br />
                      Komenského 80, <a href="tel:+420775751229">775 751 229</a>
                    </div>
                    <div className="rounded-2xl bg-sun-tint p-4">
                      <strong>E-mail</strong>
                      <br />
                      <a href="mailto:podatelna@zskostelec.cz">podatelna@zskostelec.cz</a>
                    </div>
                    <div className="rounded-2xl bg-grass-tint p-4">
                      <strong>Doručovací adresa</strong>
                      <br />
                      ZŠ Gutha-Jarkovského, Palackého náměstí 45, 517 41 Kostelec nad Orlicí
                    </div>
                  </div>
                </>
              )
            },
            {
              id: 'cenik',
              title: (
                <span className="inline-flex items-center gap-2">
                  <Receipt className="size-5" aria-hidden /> Ceník za poskytnutí informací
                </span>
              ),
              content: (
                <>
                  <table className="w-full max-w-lg border-collapse">
                    <tbody>
                      {[
                        ['Vypracování odpovědi', '100 Kč / hod'],
                        ['Vyhledávání materiálů', '70 Kč / hod'],
                        ['Kompletace materiálů, odeslání', '70 Kč / hod']
                      ].map(([what, price]) => (
                        <tr key={what} className="border-b-2 border-ink/10">
                          <td className="py-2 pr-4">{what}</td>
                          <td className="py-2 text-right font-display text-lg font-bold whitespace-nowrap">{price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-sm text-gray-6">Účtuje se za každou započatou hodinu.</p>
                </>
              )
            },
            {
              id: 'stiznosti',
              title: (
                <span className="inline-flex items-center gap-2">
                  <MessageSquareWarning className="size-5" aria-hidden /> Postup vyřizování stížností
                </span>
              ),
              content: (
                <>
                  <p>
                    Stížnosti se přijímají v pracovní dny <strong>7:30 – 15:00</strong> na podatelně školy (Komenského a
                    Náměstí), po domluvě je může přijmout i ředitel nebo jeho zástupce. Písemně i ústně – o ústní stížnosti se
                    sepíše zápis. Stěžovatel uvede jméno, příjmení a adresu pro doručení výsledku.
                  </p>
                  <p>
                    Připomínky ke konkrétním pedagogům je třeba nejprve projednat přímo s nimi. Proti rozhodnutí ředitele podle
                    správního řádu (zákon č. 500/2004 Sb.) se stížnost podává řediteli, odvolacím orgánem je Krajský úřad
                    Královéhradeckého kraje.
                  </p>
                  <p>
                    O výsledku šetření škola stěžovatele vyrozumí <strong>do 60 dnů</strong>.
                  </p>
                </>
              )
            },
            {
              id: 'rozhodnuti',
              title: (
                <span className="inline-flex items-center gap-2">
                  <Scale className="size-5" aria-hidden /> Rozhodnutí ředitele ve státní správě
                </span>
              ),
              content: (
                <ul>
                  <li>
                    zamítnutí žádosti o povolení individuálního vzdělávacího plánu podle § 18 a zamítnutí žádosti o přeřazení
                    žáka do vyššího ročníku podle § 17 odst. 3,
                  </li>
                  <li>
                    přijetí dítěte k předškolnímu vzdělávání podle § 34 a ukončení předškolního vzdělávání, zařazení dítěte do
                    přípravného stupně základní školy speciální podle § 48a, zařazení dítěte do přípravné třídy základní školy
                    podle § 47,
                  </li>
                  <li>zamítnutí žádosti o odklad povinné školní docházky podle § 37,</li>
                  <li>převedení žáka do odpovídajícího ročníku základní školy podle § 39 odst. 2,</li>
                  <li>zamítnutí žádosti o pokračování v základním vzdělávání podle § 55 odst. 1,</li>
                  <li>povolení a zrušení povolení individuálního vzdělávání žáka podle § 41,</li>
                  <li>
                    přijetí k základnímu vzdělávání podle § 46, přestup žáka podle § 49 odst. 1, převedení žáka do jiného
                    vzdělávacího programu podle § 49 odst. 2 a zamítnutí žádosti o povolení pokračování v základním vzdělávání
                    podle § 55 odst. 2.
                  </li>
                </ul>
              )
            },
            {
              id: 'predpisy',
              title: (
                <span className="inline-flex items-center gap-2">
                  <FileText className="size-5" aria-hidden /> Nejdůležitější předpisy
                </span>
              ),
              content: (
                <ul>
                  <li>Zákon č. 561/2004 Sb., školský zákon</li>
                  <li>Zákon č. 563/2004 Sb., o pedagogických pracovnících</li>
                  <li>Zákon č. 500/2004 Sb., správní řád</li>
                  <li>Nařízení vlády č. 75/2005 Sb., o rozsahu přímé vyučovací a výchovné činnosti</li>
                  <li>Vyhláška č. 317/2005 Sb., o dalším vzdělávání pedagogických pracovníků</li>
                  <li>Vyhláška č. 106/2001 Sb., o hygienických požadavcích na zotavovací akce pro děti</li>
                  <li>Vyhláška č. 410/2005 Sb., o hygienických požadavcích na prostory a provoz škol</li>
                  <li>Vyhláška MŠMT č. 15/2005 Sb., o dlouhodobých záměrech, výročních zprávách a vlastním hodnocení školy</li>
                  <li>Vyhláška MŠMT č. 48/2005 Sb., o základním vzdělávání</li>
                  <li>Vyhláška MŠMT č. 64/2005 Sb., o evidenci úrazů dětí, žáků a studentů</li>
                  <li>Vyhláška MŠMT č. 72/2005 Sb., o poskytování poradenských služeb</li>
                  <li>Vyhláška MŠMT č. 27/2016 Sb., o vzdělávání žáků se SVP a žáků nadaných</li>
                  <li>Vyhláška MŠMT č. 74/2005 Sb., o zájmovém vzdělávání</li>
                  <li>Vyhláška MŠMT č. 107/2005 Sb., o školním stravování</li>
                </ul>
              )
            }
          ]}
        />
        <Callout className="mt-6" icon={FileText} accent={accentAt(3)} title="Výroční zprávy">
          Najdete je v <Link href="/dokumenty/">Dokumentech</Link> v sekci výroční zprávy.
        </Callout>
      </Section>
    </>
  )
}
