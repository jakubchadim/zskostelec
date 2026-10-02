import { Award, BookOpen, Coins, Flag, GraduationCap, Landmark, Quote } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { Container } from '@/components/ui/container'
import { accentAt } from '@/components/ui/accent'
import { Callout, DocList, FactGrid, IconCard, JumpNav, Section } from '@/components/static/kit'
import { Timeline, type TimelineEvent } from '@/components/static/timeline'
import { staticPageMetadata } from '@/components/static/meta'

export const metadata = staticPageMetadata({
  title: 'Historie',
  description: 'Z historie škol a školství v Kostelci nad Orlicí a život Jiřího Gutha-Jarkovského, jehož jméno škola nese.',
  path: '/historie/'
})

const EVENTS: TimelineEvent[] = [
  {
    year: '14. stol.',
    title: 'Kostelecké děkanství',
    summary: 'Kostelec se stává sídlem jednoho ze dvou podorlických děkanství (druhé bylo v Dobrušce).',
    detail: (
      <p>
        K děkanství kosteleckému patřilo 36 farností – např. Choceň, Týniště, Častolovice, Rychnov či Vamberk – a ví se, že
        při farách byly zřizovány školy v plné jedné třetině. Dá se tedy předpokládat, že farní škola v Kostelci existovala
        mnohem dřív, než o ní máme písemný doklad.
      </p>
    )
  },
  {
    year: '1519',
    title: 'První písemná zmínka',
    summary: (
      <>
        Nejstarší doložená zmínka o škole v Kostelci – škole bratrské: <em>„Kdož se mezi ně /tj. bratry/ dá, hned čísti umí.“</em>
      </>
    )
  },
  {
    year: '1773',
    title: 'Vlastní školní budova',
    summary: 'Původně se učilo v prostoru fary. Koncem 18. století vzniká první budova určená k vyučování.',
    detail: (
      <p>
        Postavena byla krátce po přestavbě děkanského kostela sv. Jiří (1773) na místě zrušeného hřbitova, který se ke
        kostelu přimykal. Dnes je v budově umístěn Klub důchodců.
      </p>
    )
  },
  {
    year: '1853',
    title: 'Hlavní škola',
    summary: '28. září 1853 bylo městu povoleno zřídit tzv. hlavní školu s vyšším vzděláním než dosavadní „triviálka“.',
    detail: (
      <>
        <p>
          Šlo o další krok vpřed v péči o vzdělání, a to i dívek – vznikly dívčí školy. Dívčí obecná škola byla umístěna
          zčásti u kostela, zčásti na radnici.
        </p>
        <p>
          Ve městě se také zvažovala soukromá dívčí škola německá, o kterou usilovali pan G. Holoubek, ředitel zdejšího
          panství, a dr. Egger, hraběcí a městský lékař. Z německé školy nakonec sešlo – zásluhou tehdy mladého
          dr. Gutha-Jarkovského. Učilo se jen pro dcery zmíněných činovníků ve starém zámku a škola zanikla s ukončením jejich
          docházky.
        </p>
      </>
    )
  },
  {
    year: '1869',
    title: 'Konec církevního dozoru',
    summary: 'V našich zemích byl zrušen církevní dozor nad školami; vznikají školní rady a inspektoráty.'
  },
  {
    year: '1875',
    title: 'Domy na náměstí a Na Lávkách',
    summary: 'Domy č. 45 na náměstí a č. 46 v ulici Na Lávkách jsou přestavěny pro potřeby školy – a slouží jí dodnes.',
    detail: (
      <p>
        Postaveny byly v 70. letech 19. století pro ubytování hraběcích odborníků na stavbě cukrovaru a železnice. Od roku
        1875 slouží škole – už více než 120 let.
      </p>
    )
  },
  {
    year: '1901',
    title: 'Skalecká škola',
    summary: 'Do otevření skalecké školy se na Skále učilo provizorně – např. v hostinci u Hofmanů.'
  },
  {
    year: '1925',
    title: 'Volání po nových budovách',
    summary: 'Objevují se vážné připomínky k prostředí školy a k nutnosti postavit nové budovy.',
    detail: (
      <p>
        Překrásnou secesní novostavbu z poloviny 90. let 19. století rozhodlo zastupitelstvo věnovat nově založené reálce. I
        když se v jejích prostorách učily děti ze základního stupně vlastně až do počátku 90. let 20. století, bylo to vždy
        pociťováno jako provizorium.
      </p>
    )
  }
]

export default function HistoriePage() {
  return (
    <>
      <PageHero
        title="Historie"
        colorKey="historie"
        eyebrow="Z historie škol a školství v Kostelci nad Orlicí"
        lead="Od bratrské školy v roce 1519 až po budovy, ve kterých se učí dodnes. A kdo byl Jiří Guth-Jarkovský?"
      >
        <JumpNav
          items={[
            { href: '#casova-osa', label: 'Časová osa' },
            { href: '#kantori', label: 'Jak žili kantoři' },
            { href: '#guth-jarkovsky', label: 'Jiří Guth-Jarkovský' },
            { href: '#ke-stazeni', label: 'Ke stažení' }
          ]}
        />
      </PageHero>

      <Container className="pt-4">
        <Callout icon={BookOpen} accent={accentAt(1)}>
          <p className="m-0">
            Vzdělání šířené slovem i písmem je v našich zemích spojeno s přijetím křesťanství. Na úsvitu našich kulturních
            dějin byly školy těsně svázány s církví – o vzdělanost pečovaly nejprve kláštery, později farní školy. I v našem
            městě se školství těšilo náležité pozornosti; tady je stručný nástin jeho vývoje.
          </p>
        </Callout>
      </Container>

      <Section id="casova-osa" eyebrow="Časová osa" title="Pět století kosteleckých škol">
        <Timeline events={EVENTS} />
      </Section>

      <Section id="kantori" eyebrow="Věděli jste?" title="Jak žili kantoři" tinted accent={accentAt(0)}>
        <p className="mb-6 max-w-3xl text-lg">
          Slovo kantor pochází z latinského <em>cantare</em> – zpívati. Postavení kantorů záviselo na mohovitosti obce a jejích
          obyvatel. Penze nebyly – začasté vynesli kantora ze školy rovnou na hřbitov.
        </p>
        <FactGrid
          facts={[
            {
              icon: Coins,
              label: 'Kantor v Kostelecké Lhotě',
              value: '81 zl. 15 kr.',
              hint: 'ročně, k tomu 13 sáhů dřeva, dvě louky a jeden a půl korce pole – a povinnost zvonit poledne a klekání.'
            },
            {
              icon: GraduationCap,
              label: 'Jan Ladislav Mašek',
              value: '100 zlatých',
              hint: 'ročně pobíral znamenitý kostelecký pedagog. O dalších naturáliích se nedozvíme.'
            },
            {
              icon: Landmark,
              label: 'Sobotáles',
              value: 'mzda v naturáliích',
              hint: 'Nezřídka kantor místo peněz dostal jen sobotní naturální odměnu, kterou mu nosili žáci.'
            }
          ]}
        />
      </Section>

      <Section id="guth-jarkovsky" eyebrow="Jméno naší školy" title="Jiří Guth-Jarkovský">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="text-lg [&_p+p]:mt-4">
            <p>
              Nebyl kostelecký rodák, ani v Kostelci nezemřel, ale k našemu městu měl vřelý vztah. Pocházela odsud jeho rodina
              a prožil zde 10 let dospívání a mládí.
            </p>
            <p>
              Jiří Stanislav Guth se narodil jako 6. dítě z 8 knížecímu úředníkovi Karlu Guthovi a Barboře, rozené Bačinové,
              dceři kosteleckého perníkáře. Otec se ženil v 41 letech, matka se vdávala v 16. Oba rodiče pocházeli z Kostelce
              nad Orlicí, ale protože otec spravoval statky knížete Kinského v Heřmanově Městci, žila rodina tam.
            </p>
            <figure className="sticker mt-6 flex gap-4 bg-sun-tint p-5">
              <Quote className="size-8 shrink-0 text-primary-3" aria-hidden />
              <blockquote className="m-0">
                <p className="m-0 font-display text-xl leading-snug">
                  „Kdo to byl Guth-Jarkovský?“ – „Byl to člověk, který se zabýval pravidly slušného chování.“
                </p>
                <figcaption className="mt-2 text-sm text-gray-7">Odpověď, kterou bychom možná dostali od staršího pamětníka</figcaption>
              </blockquote>
            </figure>
          </div>
          <div className="grid content-start gap-4">
            <IconCard icon={Flag} title="Olympionik" accent={accentAt(1)}>
              Jeden ze zakládajících členů Mezinárodního olympijského výboru a 1. předseda Českého olympijského výboru.
            </IconCard>
            <IconCard icon={Award} title="Ceremoniář prezidenta" accent={accentAt(2)}>
              Ceremoniář prezidenta T. G. Masaryka a autor slavných pravidel společenského chování.
            </IconCard>
            <IconCard icon={GraduationCap} title="Profesor a spisovatel" accent={accentAt(3)}>
              Gymnaziální profesor, spisovatel a turistický organizátor.
            </IconCard>
          </div>
        </div>
      </Section>

      <Section id="ke-stazeni" eyebrow="Ke stažení" title="Celé texty">
        <DocList
          docs={[
            { title: 'Historie škol v Kostelci nad Orlicí', href: '/soubory/historie/histskol.pdf', note: 'PDF' },
            { title: 'Jiří Guth-Jarkovský', href: '/soubory/historie/jguthjark.pdf', note: 'PDF – celý životopis' }
          ]}
        />
      </Section>
    </>
  )
}
