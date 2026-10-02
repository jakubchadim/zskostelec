import { Ban, Clock, Gem, Leaf, PencilLine, Snowflake, Sparkles, Sun, Flower2, Wallet, CalendarOff, Utensils } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { accentAt } from '@/components/ui/accent'
import { Callout, FactGrid, IconCard, Section } from '@/components/static/kit'
import { staticPageMetadata } from '@/components/static/meta'
import { cn } from '@/lib/utils'

export const metadata = staticPageMetadata({
  title: 'Školní družina',
  description: 'Školní družina na pracovištích Erbenova a Drtinova: provozní doba, vychovatelky, poplatky, pravidla a akce během roku.',
  path: '/skolni-druzina/'
})

const WORKPLACES = [
  {
    name: 'Erbenova 891',
    hours: '6:00 – 16:00',
    staff: ['Jitka Bezdíčková – vedoucí vychovatelka', 'Marcela Bělobrádková', 'Mgr. Jitka Šveidlerová']
  },
  { name: 'Drtinova 662', hours: '6:15 – 16:00', staff: ['Eva Jelínková', 'Bc. Veronika Špačková'] }
]

/** The year's events grouped by season (the list on the old page, sorted for the calendar). */
const SEASONS = [
  {
    name: 'Podzim',
    icon: Leaf,
    events: ['Seznámení s novými kamarády', 'Pouštění draků', 'Halloweenské vyrábění', 'Stezka odvahy']
  },
  {
    name: 'Zima',
    icon: Snowflake,
    events: ['Mikuláš ve družině', 'Vánoční dílničky', 'Návštěva betlémů', 'Zimní radovánky', 'Valentýnské vyrábění', 'Karneval']
  },
  {
    name: 'Jaro',
    icon: Flower2,
    events: ['Velikonoční dílničky', 'Čarodějnický rej', 'Den matek', 'Olympijské hry']
  },
  { name: 'Léto', icon: Sun, events: ['Den otců', 'Zmrzlina na rozloučenou'] },
  {
    name: 'Celý rok',
    icon: Sparkles,
    events: [
      'Sobotní výpravy za dobrodružstvím a poznáním',
      'Návštěva kina',
      'Návštěva divadla',
      'Návštěva kouzelníka',
      'Návštěva odborníků z praxe',
      'Výtvarné soutěže',
      'Charitativní akce'
    ]
  }
]

export default function SkolniDruzinaPage() {
  return (
    <>
      <PageHero
        title="Školní družina"
        colorKey="skolni-druzina"
        eyebrow="Informace"
        lead="Mezistupeň mezi výukou ve škole a výchovou v rodině. Tady se odpočívá, tvoří, sportuje a hlavně si hraje."
      >
        <figure className="sticker m-0 max-w-md -rotate-1 bg-paper p-5">
          <blockquote className="m-0 font-display text-xl leading-snug">
            Ať je léto nebo zima,
            <br />v družině je vždycky prima.
            <br />
            Zahoď nudu za hlavu,
            <br />
            pojď si spravit náladu.
            <br />
            Odpočívat nebo jen si hrát,
            <br />
            buď také náš kamarád.
          </blockquote>
        </figure>
      </PageHero>

      <Section eyebrow="Co u nás děláme" title="Hry, tvoření a pobyt venku">
        <div className="grid gap-6 text-lg md:grid-cols-2 [&_p]:m-0">
          <p>
            Družina není pokračováním vyučování. Jejím posláním je zájmová činnost, rekreace a odpočinek dětí. Děti si vybírají
            z her, stavebnic, knih, časopisů a hraček, které každý rok doplňujeme, a samy se rozhodují, do čeho se zapojí.
          </p>
          <p>
            Pravidelně připravujeme výtvarné, pracovní, hudební, literární, poznávací a pohybové činnosti. Hodně chodíme ven – na
            vycházky po okolí nebo na naši zahradu s pískovištěm, hrací plochou, hřištěm a skluzavkou.
          </p>
        </div>
      </Section>

      <Section eyebrow="Kde a kdy" title="Dvě pracoviště" tinted accent={accentAt(3)}>
        <div className="grid gap-4 md:grid-cols-2">
          {WORKPLACES.map((w, idx) => (
            <article key={w.name} className="sticker flex flex-col gap-4 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-2xl">{w.name}</h3>
                <span className={cn('flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1 font-display text-lg font-bold', accentAt(idx).tint)}>
                  <Clock className="size-5" aria-hidden /> {w.hours}
                </span>
              </div>
              <ul className="m-0 grid list-none gap-2 p-0">
                {w.staff.map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className={cn('size-2.5 rounded-full', accentAt(idx + 2).bg)} aria-hidden />
                    {s}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <Callout className="mt-6" icon={Utensils} accent={accentAt(0)} title="Cesta na oběd">
          Děti 1. a 2. ročníků chodí na oběd pod dozorem vychovatelek. Třeťáci chodí ze školy do jídelny a z jídelny do družiny
          sami – vychovatelka za ně odpovídá až od příchodu do oddělení.
        </Callout>
      </Section>

      <Section eyebrow="Poplatky a prázdniny" title="Co je dobré vědět">
        <FactGrid
          facts={[
            { icon: Wallet, label: 'Družina', value: '1 000 Kč', hint: 'za pololetí' },
            { icon: Sun, label: 'Ranní družina', value: '400 Kč', hint: 'za pololetí' },
            {
              icon: CalendarOff,
              label: 'Prázdniny',
              value: 'jen vedlejší',
              hint: 'Na pracovišti Erbenova, přihlásí-li se alespoň 10 dětí. O letních prázdninách je družina zavřená.'
            }
          ]}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <IconCard icon={Ban} title="Bez mobilů" accent={accentAt(2)}>
            Mobily, chytré hodinky, tablety ani elektronické hry se v družině nepoužívají. Když dítě potřebuje zavolat rodičům,
            domluví se s paní vychovatelkou.
          </IconCard>
          <IconCard icon={Gem} title="Cennosti na vlastní riziko" accent={accentAt(4)}>
            Mobil, peníze nebo hračky si žák do družiny nosí na vlastní nebezpečí a zodpovědnost.
          </IconCard>
          <IconCard icon={PencilLine} title="Jiný odchod jen písemně" accent={accentAt(1)}>
            Odchod jinak než podle zápisového lístku sdělte vychovatelce písemně na omluvence: datum, jméno, čas odchodu a podpis
            rodiče.
          </IconCard>
        </div>
      </Section>

      <Section eyebrow="Celý rok" title="Akce, na které se těšíme" tinted accent={accentAt(1)}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {SEASONS.map((season, idx) => (
            <div key={season.name} className={cn('sticker flex flex-col gap-3 p-5', accentAt(idx).tint)}>
              <h3 className="flex items-center gap-2 font-display text-xl">
                <season.icon className={cn('size-6', accentAt(idx).text)} aria-hidden />
                {season.name}
              </h3>
              <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                {season.events.map((e) => (
                  <li key={e} className="rounded-full border-2 border-ink/20 bg-paper px-2.5 py-0.5 text-sm font-semibold">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

    </>
  )
}
