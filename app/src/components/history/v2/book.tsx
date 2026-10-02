import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ETIQUETTE_RULES, PHOTOS } from '../story'
import { InnSignArt, ArrivalArt, BellArt, BookArt, CastleArt, DecreeArt, DreamArt, FieldArt, OlympicArt, PayArt, PeekArt, RunArt, TodayArt, TrailArt } from './art'
import { Art, Body, Bubble, Burst, Captions, chapter, ComicPhoto, Fun, Head, Panel, Sfx, TONE, Typed, styles, type Tone } from './comic'
import { Guth, type GuthMood, type GuthVariant } from './guth'
import { EtiquetteQuiz } from './quiz'
import { ComicStage } from './stage'

/**
 * "Kluk s brýlemi" - the school's history as a four-issue comic narrated by
 * Jiří Guth-Jarkovský (the mascot from the school logo). Facts come from
 * story.ts (chapter texts are shown in full as caption boxes); the speech
 * bubbles are short comic retellings of those same facts.
 */

const WHO: Record<GuthVariant, string> = {
  kid: 'Malý Jiří',
  young: 'Mladý Jiří',
  gent: 'Pan Guth',
  coubertin: 'Baron Coubertin'
}

/** Round narrator head + speech bubble. */
function Talk({ variant = 'gent', mood = 'talk', tip, children }: { variant?: GuthVariant; mood?: GuthMood; tip?: boolean; children: ReactNode }) {
  return (
    <div className={styles.talk}>
      <div className={styles.head64} aria-hidden>
        <Guth variant={variant} mood={mood} tip={tip} crop />
      </div>
      <Bubble who={WHO[variant]} tail="l">
        {children}
      </Bubble>
    </div>
  )
}

/** A character standing inside an art frame (decorative). */
function Actor({ style, children }: { style: CSSProperties; children: ReactNode }) {
  return (
    <div className={styles.actor} style={style} aria-hidden>
      {children}
    </div>
  )
}

function IssueCover({
  n,
  title,
  range,
  blurb,
  tone,
  art
}: {
  n: number
  title: string
  range: string
  blurb: string
  tone: Tone
  art: ReactNode
}) {
  return (
    <Panel span={6} tone={tone} as="div" tilt={0}>
      <div className={cn(styles.issueCover, styles.speed)}>
        <div className={styles.issuePrice} aria-hidden>
          Cena
          <br />2 krejcary
        </div>
        <div className={styles.issueText}>
          <span className={styles.issueNo}>Sešit č. {n}</span>
          <h2 id={`sesit-${n}-title`} className={styles.issueTitle}>
            <span className="sr-only">Sešit {n}: </span>
            {title}
          </h2>
          <span className={styles.issueRange}>{range}</span>
          <p className={styles.issueBlurb}>{blurb}</p>
        </div>
        <div className={styles.issueArt} aria-hidden>
          {art}
        </div>
      </div>
    </Panel>
  )
}

function Issue({ n, tone, children }: { n: number; tone: Tone; children: ReactNode }) {
  return (
    <section id={`sesit-${n}`} aria-labelledby={`sesit-${n}-title`} className={cn(styles.issue, TONE[tone])}>
      <div className={styles.grid}>{children}</div>
    </section>
  )
}

/* ================================================================ cover */

const ISSUES = [
  { n: 1, title: 'Škola u fary', tone: 'sun' as Tone },
  { n: 2, title: 'Kluk s brýlemi', tone: 'sky' as Tone },
  { n: 3, title: 'Olympionik a pan ceremoniář', tone: 'grape' as Tone },
  { n: 4, title: 'Škola dnes', tone: 'grass' as Tone }
]

function Cover() {
  return (
    <header data-panel className={cn(styles.cover, styles.speed, TONE.tangerine)}>
      <div>
        <Link href="/historie/" className={styles.backLink}>
          <span aria-hidden>←</span> Historie
        </Link>
        <div className={styles.masthead} style={{ marginTop: 18 }}>
          <span className={styles.mastChip}>Školní komiks</span>
          <span className={styles.mastChip}>4 sešity</span>
          <span className={styles.mastChip}>14. stol. – dnes</span>
        </div>
        <h1 className={styles.logoTitle}>
          <span>Kluk</span> <span>s brýlemi</span>
        </h1>
        <p className={styles.coverLead}>
          Pět století kostelecké školy v komiksu. Vypráví Jiří Guth-Jarkovský – ano, ten pán s kloboukem a brýlemi z našeho
          školního loga.
        </p>
        <nav aria-label="Sešity komiksu">
          <ul className={styles.toc}>
            {ISSUES.map((i) => (
              <li key={i.n} className={TONE[i.tone]}>
                <a href={`#sesit-${i.n}`} className={styles.tocLink}>
                  <b>#{i.n}</b> {i.title}
                </a>
              </li>
            ))}
            <li className={TONE.berry}>
              <a href="#kviz" className={styles.tocLink}>
                <b>?</b> Kvíz
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.coverArt}>
        <Bubble who="Pan Guth" float tail="br" style={{ top: 0, left: 0, maxWidth: 'min(78%, 300px)' }}>
          <Typed text="Ahoj! Jsem Jiří. Pojďte, ukážu vám, jak to tady všechno začalo!" />
        </Bubble>
        <div style={{ width: 'min(300px, 62%)', marginTop: 90 }} aria-hidden>
          <Guth variant="gent" mood="talk" wave bob />
        </div>
      </div>
    </header>
  )
}

/* ============================================================ issue 1 */

function Issue1() {
  const dek = chapter('dekanstvi')
  const brat = chapter('bratrska')
  const kan = chapter('kantori')
  const prvni = chapter('prvni-budova')
  const lhota = chapter('lhota')
  const hlavni = chapter('hlavni-skola')

  return (
    <Issue n={1} tone="sun">
      <IssueCover
        n={1}
        tone="sun"
        title="Škola u fary"
        range="14. stol. – 1853"
        blurb="Jak se učilo, když ještě nebyly školní budovy – a čím se platilo kantorovi."
        art={<Guth variant="gent" mood="smile" book />}
      />

      <Panel span={4} tone="sun" tilt={-0.5} labelledBy={`ch-${dek.id}`}>
        <Burst>{dek.year}</Burst>
        <Body>
          <Head ch={dek} />
          <Captions ch={dek} label="Kdysi dávno…" />
          <Talk>Tady to všechno začalo. Žádná školní budova – učilo se přímo na faře!</Talk>
          {dek.fun && <Fun>{dek.fun}</Fun>}
        </Body>
        <Art decorative={false}>
          <ComicPhoto photo={PHOTOS.dekanstvi} />
        </Art>
      </Panel>

      <Panel span={2} tone="sky" tilt={0.8} labelledBy={`ch-${brat.id}`}>
        <Burst color="#3a9bff">{brat.year}</Burst>
        <Body>
          <Head ch={brat} />
          <Captions ch={brat} label="Roku 1519" />
          <Talk mood="wink">Hned čísti umí? Takovou školu bych bral!</Talk>
        </Body>
        <Art ratio="4 / 3">
          <BookArt />
          <Sfx style={{ right: '6%', bottom: '8%' }} color="#ff5c8a" rotate={10}>
            Šup!
          </Sfx>
        </Art>
      </Panel>

      <Panel span={6} tone="sky" tilt={-0.3} labelledBy={`ch-${kan.id}`}>
        <Burst>{kan.year}</Burst>
        <Body>
          <Head ch={kan} />
          <div className={styles.split}>
            <div className={styles.stack}>
              <Captions ch={kan} label="Jak se žilo kantorům" />
            </div>
            <div className={styles.stack}>
              <Talk mood="wow">Výplata v naturáliích – a ještě v sobotu! A penze? Žádná.</Talk>
              {kan.fun && <Fun>{kan.fun}</Fun>}
            </div>
          </div>
        </Body>
        <div className={styles.beats} aria-hidden>
          <div className={styles.beat}>
            <BellArt />
            <Sfx style={{ left: '5%', top: '22%' }} rotate={-12}>
              Cink!
            </Sfx>
            <Sfx style={{ right: '4%', top: '44%' }} rotate={9} color="#ff8a00">
              Cink!
            </Sfx>
          </div>
          <div className={styles.beat}>
            <PayArt />
          </div>
          <div className={styles.beat} style={{ background: 'var(--color-sun-tint)', display: 'grid', placeItems: 'center' }}>
            <span className={styles.theEnd} style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.3rem)', textAlign: 'center', color: 'var(--color-sun)' }}>
              81 zl.
              <br />
              15 kr.
              <br />
              <span style={{ fontSize: '0.55em', color: 'var(--color-paper)' }}>ročně</span>
            </span>
          </div>
        </div>
      </Panel>

      <Panel span={3} tone="tangerine" tilt={0.6} labelledBy={`ch-${prvni.id}`}>
        <Burst color="#ff8a00">{prvni.year}</Burst>
        <Body>
          <Head ch={prvni} />
          <Captions ch={prvni} />
          <Talk mood="smile">Konečně dům jen pro školu. A pořád stojí!</Talk>
        </Body>
        <Art decorative={false}>
          <ComicPhoto photo={PHOTOS.prvniBudova} />
          <Sfx style={{ right: '5%', top: '8%' }} rotate={8} color="#ffcf33">
            Buch! Buch!
          </Sfx>
        </Art>
      </Panel>

      <Panel span={3} tone="grass" tilt={-0.7} labelledBy={`ch-${lhota.id}`}>
        <Burst color="#2fbf71">{lhota.year}</Burst>
        <Body>
          <Head ch={lhota} />
          <Captions ch={lhota} />
          <Talk mood="wow">50 až 60 dětí v jedné třídě! Zkuste si představit tu přestávku.</Talk>
        </Body>
        <Art decorative={false}>
          <ComicPhoto photo={PHOTOS.lhota} />
          <Sfx style={{ right: '6%', top: '8%' }} rotate={-6} color="#2fbf71">
            Ššššt!
          </Sfx>
        </Art>
      </Panel>

      <Panel span={6} tone="berry" tilt={0.3} row labelledBy={`ch-${hlavni.id}`}>
        <Burst color="#ff5c8a">{hlavni.year}</Burst>
        <Body>
          <Head ch={hlavni} />
          <Captions ch={hlavni} label="28. září 1853" />
          <Talk variant="young" mood="wink">
            Ten mladý Guth? To jsem byl já! Ale nepředbíhejme…
          </Talk>
        </Body>
        <Art ratio="16 / 11">
          <DecreeArt />
          <Sfx style={{ right: '6%', top: '10%' }} rotate={12} color="#ff5c8a">
            Bác!
          </Sfx>
        </Art>
      </Panel>
    </Issue>
  )
}

/* ============================================================ issue 2 */

function Issue2() {
  const kluk = chapter('jiri-kluk')
  const stesk = chapter('stesk')
  const nam = chapter('namesti')

  return (
    <Issue n={2} tone="sky">
      <IssueCover
        n={2}
        tone="sky"
        title="Kluk s brýlemi"
        range="1868 – 1878"
        blurb="Bojácný kluk s brýlemi se stěhuje do Kostelce. Ještě netuší, že jednou ponese jeho jméno škola."
        art={<Guth variant="kid" mood="smile" wave />}
      />

      <Panel span={4} tone="sky" tilt={-0.6} labelledBy={`ch-${kluk.id}`}>
        <Burst color="#3a9bff">{kluk.year}</Burst>
        <Body>
          <Head ch={kluk} />
          <Captions ch={kluk} label="Roku 1868" />
          {kluk.fun && <Fun>{kluk.fun}</Fun>}
        </Body>
        <Art decorative={false}>
          <ArrivalArt />
          <Bubble who="Malý Jiří" float tail="bl" style={{ top: '9%', left: '27%' }}>
            <Typed text="Ahoj, Kostelče! Teď tu bydlím já." />
          </Bubble>
          <Actor style={{ left: '7%', width: '30%' }}>
            <Guth variant="kid" mood="talk" wave bob />
          </Actor>
        </Art>
      </Panel>

      <Panel span={2} tone="sky" tilt={1} as="div">
        <Body>
          <Talk variant="kid" mood="wink">
            Tohle jsem já. Teda… o pár desítek let později.
          </Talk>
          <Talk variant="kid" mood="smile">
            Brýle mi zůstaly. Koktání jsem nakonec vycvičil – takže: nevzdávat!
          </Talk>
        </Body>
        <Art decorative={false} ratio="4 / 5">
          <ComicPhoto photo={PHOTOS.guth} position="50% 20%" sizes="(min-width: 882px) 360px, 100vw" />
        </Art>
      </Panel>

      <Panel span={6} tone="tangerine" tilt={-0.25} labelledBy={`ch-${stesk.id}`}>
        <Burst color="#ff8a00">{stesk.year}</Burst>
        <Body>
          <Head ch={stesk} />
          <div className={styles.split}>
            <Captions ch={stesk} from={0} to={1} label="Gymnázium v Rychnově" />
            <Captions ch={stesk} from={1} />
          </div>
        </Body>
        <div className={styles.beats}>
          <div className={styles.beat}>
            <FieldArt aria-hidden />
            <div aria-hidden>
              <Actor style={{ left: '4%', width: '34%' }}>
                <Guth variant="kid" mood="smile" book />
              </Actor>
            </div>
            <Bubble who="Malý Jiří" thought float style={{ top: 10, left: '24%', fontSize: '0.92rem' }}>
              Už vidím věže svaté Anny!
            </Bubble>
          </div>
          <div className={styles.beat}>
            <PeekArt aria-hidden />
            <Sfx style={{ right: '6%', top: '8%' }} rotate={10} color="#3a9bff">
              Kuk!
            </Sfx>
          </div>
          <div className={styles.beat}>
            <RunArt aria-hidden />
            <div aria-hidden>
              <Actor style={{ left: '8%', width: '52%', bottom: '-14%', transform: 'rotate(-12deg)' }}>
                <Guth variant="kid" mood="wow" />
              </Actor>
            </div>
            <Bubble who="Malý Jiří" float tail="bl" style={{ top: 8, left: '6%', fontSize: '0.9rem', maxWidth: '86%' }}>
              Rychle zpátky, ať se maminka nezlobí!
            </Bubble>
            <Sfx style={{ right: '4%', bottom: '24%' }} rotate={-4} size="1.7rem" color="#ff8a00">
              Frrr!
            </Sfx>
          </div>
        </div>
      </Panel>

      <Panel span={6} tone="sun" tilt={0.4} row labelledBy={`ch-${nam.id}`}>
        <Burst>{nam.year}</Burst>
        <Body>
          <Head ch={nam} />
          <Captions ch={nam} label="Domy č. 45 a 46" />
          <Talk variant="kid" mood="wow">
            Počkat… vždyť to je naše škola na Palackého náměstí!
          </Talk>
        </Body>
        <Art decorative={false}>
          <ComicPhoto photo={PHOTOS.namesti45} />
          <Sfx style={{ right: '5%', top: '8%' }} rotate={8}>
            36 000 zl.!
          </Sfx>
        </Art>
      </Panel>
    </Issue>
  )
}

/* ============================================================ issue 3 */

function Issue3() {
  const oly = chapter('olympiada')
  const real = chapter('realka')
  const skala = chapter('skala')
  const hrad = chapter('hrad')
  const stezka = chapter('stezka')
  const mas = chapter('masaryk')
  const nova = chapter('nova-skola')

  return (
    <Issue n={3} tone="grape">
      <IssueCover
        n={3}
        tone="grape"
        title="Olympionik a pan ceremoniář"
        range="1894 – 1939"
        blurb="Z bojácného kluka je doktor, kamarád barona Coubertina a ceremoniář prezidenta. A Kostelec mezitím staví školy."
        art={<Guth variant="young" mood="smile" wave />}
      />

      {/* SPLASH: 1894 */}
      <Panel span={6} tone="sky" tilt={-0.2} labelledBy={`ch-${oly.id}`}>
        <Burst>{oly.year}</Burst>
        <Body>
          <Head ch={oly} />
          <div className={styles.split}>
            <div className={styles.stack}>
              <Captions ch={oly} label="Z kluka doktorem" />
            </div>
            <div className={styles.stack}>
              <div className={styles.inset}>
                <ComicPhoto photo={PHOTOS.mov1896} sizes="(min-width: 882px) 420px, 100vw" />
              </div>
              {oly.fun && <Fun>{oly.fun}</Fun>}
            </div>
          </div>
        </Body>
        <Art decorative={false} className={cn(styles.speed, styles.splash)}>
          <OlympicArt />
          <Bubble who="Mladý Jiří" float tail="bl" style={{ top: '7%', left: '14%', maxWidth: 'min(38%, 260px)' }}>
            <Typed text="Nikdo se nehlásí? Tak do Paříže jedu já!" />
          </Bubble>
          <Bubble who="Baron Coubertin" float tail="br" style={{ top: '7%', right: '14%', maxWidth: 'min(34%, 230px)' }}>
            Bienvenue, monsieur Guth!
          </Bubble>
          <Actor style={{ left: '2%', width: 'max(24%, 110px)' }}>
            <Guth variant="young" mood="talk" bob />
          </Actor>
          <Actor style={{ right: '2%', width: 'max(24%, 110px)' }}>
            <Guth variant="coubertin" mood="smile" flip bob />
          </Actor>
        </Art>
      </Panel>

      <Panel span={4} tone="grape" tilt={0.5} labelledBy={`ch-${real.id}`}>
        <Burst color="#8a5cf6">{real.year}</Burst>
        <Body>
          <Head ch={real} />
          <Captions ch={real} to={1} label="19. září 1897" />
          <div className={styles.split}>
            <Captions ch={real} from={1} />
            <div className={styles.inset}>
              <ComicPhoto photo={PHOTOS.rolnicka} caption={false} sizes="240px" />
            </div>
          </div>
          {real.fun && <Fun>{real.fun}</Fun>}
        </Body>
        <Art decorative={false}>
          <ComicPhoto photo={PHOTOS.realka} />
        </Art>
      </Panel>

      <Panel span={2} tone="tangerine" tilt={-1} labelledBy={`ch-${skala.id}`}>
        <Burst color="#ff8a00">{skala.year}</Burst>
        <Body>
          <Head ch={skala} />
          <Captions ch={skala} />
          <Talk mood="wink">Učit se v hospodě? Už nikdy!</Talk>
          <div aria-hidden style={{ marginTop: 'auto', paddingTop: 6 }}>
            <InnSignArt />
          </div>
        </Body>
        <Art decorative={false} ratio="4 / 3">
          <ComicPhoto photo={PHOTOS.skala} caption={false} />
          <Sfx style={{ right: '5%', top: '10%' }} rotate={8} size="1.7rem">
            Konečně!
          </Sfx>
        </Art>
      </Panel>

      {/* SPLASH: 1919 */}
      <Panel span={6} tone="berry" tilt={0.2} labelledBy={`ch-${hrad.id}`}>
        <Burst color="#ff5c8a">{hrad.year}</Burst>
        <Body>
          <Head ch={hrad} />
          <div className={styles.split}>
            <div className={styles.stack}>
              <Captions ch={hrad} label="Pražský hrad" />
              <Talk tip mood="smile">
                Od teď Guth-Jarkovský! Cítil jsem se přece především Čechem.
              </Talk>
            </div>
            <div className={styles.stack}>
              <div className={styles.inset} style={{ '--ratio': '1280 / 914' } as CSSProperties}>
                <ComicPhoto photo={PHOTOS.guth1919} sizes="(min-width: 882px) 420px, 100vw" />
              </div>
              {hrad.fun && <Fun>{hrad.fun}</Fun>}
            </div>
          </div>
        </Body>
        <Art decorative={false} className={styles.splash}>
          <CastleArt />
          <Bubble who="Pan Guth" float tail="bl" style={{ top: '8%', left: '30%', maxWidth: 'min(44%, 300px)' }}>
            <Typed text="Pane prezidente, račte prosím tudy." />
          </Bubble>
          <Actor style={{ left: '17%', width: '22%' }}>
            <Guth variant="gent" mood="talk" tip bob />
          </Actor>
          <Sfx style={{ right: '4%', top: '10%' }} rotate={6} color="#ffcf33">
            Tadá!
          </Sfx>
        </Art>
      </Panel>

      <Panel span={4} tone="grass" tilt={-0.5} labelledBy={`ch-${stezka.id}`}>
        <Burst color="#2fbf71">{stezka.year}</Burst>
        <Body>
          <Head ch={stezka} />
          <Captions ch={stezka} label="Červená značka" />
          <Talk mood="wink">Kdo jde se mnou? Je to jen 40 kilometrů!</Talk>
          {stezka.fun && <Fun>{stezka.fun}</Fun>}
        </Body>
        <Art>
          <TrailArt />
        </Art>
      </Panel>

      <Panel span={2} tone="sky" tilt={0.9} labelledBy={`ch-${mas.id}`}>
        <Burst color="#3a9bff">{mas.year}</Burst>
        <Body>
          <Head ch={mas} />
          <Captions ch={mas} />
          <div className={styles.inset}>
            <ComicPhoto photo={PHOTOS.skolaPrace} sizes="320px" />
          </div>
        </Body>
        <Art decorative={false} ratio="4 / 3">
          <ComicPhoto photo={PHOTOS.masaryk} caption={false} />
          <Sfx style={{ right: '5%', bottom: '10%' }} rotate={-8} size="1.6rem" color="#3a9bff">
            Sláva!
          </Sfx>
        </Art>
      </Panel>

      {/* SPLASH: the school that was never built */}
      <Panel span={6} tone="grape" tilt={-0.3} labelledBy={`ch-${nova.id}`}>
        <Burst color="#8a5cf6">{nova.year}</Burst>
        <Body>
          <Head ch={nova} />
          <div className={styles.split}>
            <div className={styles.stack}>
              <Captions ch={nova} label="1929 – 1939" />
            </div>
            <div className={styles.stack}>
              <Talk mood="sad">
                <Typed text="Škola, která zůstala jen na papíře…" />
              </Talk>
              {nova.fun && <Fun>{nova.fun}</Fun>}
            </div>
          </div>
        </Body>
        <Art decorative={false} className={cn(styles.dots, styles.splash)}>
          <DreamArt />
          <Bubble who="Pan Guth" thought float style={{ top: '30%', left: '3%', maxWidth: 'min(28%, 220px)' }}>
            Nová škola… Jednou určitě.
          </Bubble>
          <Actor style={{ left: '2%', width: '17%' }}>
            <Guth variant="gent" mood="sad" />
          </Actor>
          <Sfx style={{ right: '5%', top: '12%' }} rotate={12} color="#ff5c8a">
            Puf!
          </Sfx>
        </Art>
      </Panel>
    </Issue>
  )
}

/* ============================================================ issue 4 */

function Issue4() {
  const dnes = chapter('dnes')

  return (
    <Issue n={4} tone="grass">
      <IssueCover
        n={4}
        tone="grass"
        title="Škola dnes"
        range="2006 – dnes"
        blurb="Jedna škola, čtyři budovy – a jedno jméno."
        art={<Guth variant="gent" mood="smile" tip />}
      />

      <Panel span={4} tone="grass" tilt={0.4} labelledBy={`ch-${dnes.id}`}>
        <Burst color="#2fbf71">{dnes.year}</Burst>
        <Body>
          <Head ch={dnes} />
          <Captions ch={dnes} to={1} label="Od 1. 1. 2006" />
          <Talk mood="smile">Čtyři budovy, jedna škola. A pořád se tu zvoní!</Talk>
        </Body>
        <Art ratio="21 / 10">
          <TodayArt />
        </Art>
      </Panel>

      <Panel span={2} tone="sun" tilt={-0.8} as="div">
        <Body>
          <Captions ch={dnes} from={1} label="Jméno školy" />
        </Body>
        <Art decorative={false} ratio="4 / 3">
          <ComicPhoto photo={PHOTOS.deska} caption={false} sizes="(min-width: 882px) 360px, 100vw" />
        </Art>
      </Panel>

      <Panel span={6} tone="tangerine" tilt={0} row as="div">
        <Body className="justify-center">
          <p className={styles.theEnd} aria-hidden>
            Konec?
          </p>
          <div className={styles.stack}>
            <Bubble who="Malý Jiří" tail="l" showWho style={{ alignSelf: 'flex-start', marginLeft: 18 }}>
              Takže ta škola nese moje jméno? Toho kluka, co se bál?
            </Bubble>
            <Bubble who="Pan Guth" tail="l" showWho style={{ alignSelf: 'flex-end', marginLeft: 40, marginTop: 8 }}>
              <Typed text="Přesně tak, Jiříku. A teď je řada na vás – tenhle příběh pokračuje každý den." />
            </Bubble>
          </div>
        </Body>
        <Art className={styles.speed} ratio="16 / 10">
          <Actor style={{ left: '8%', width: '36%' }}>
            <Guth variant="kid" mood="wow" bob />
          </Actor>
          <Actor style={{ right: '6%', width: '44%' }}>
            <Guth variant="gent" mood="smile" tip wave />
          </Actor>
        </Art>
      </Panel>
    </Issue>
  )
}

/* ============================================================== quiz */

function Quiz() {
  return (
    <section id="kviz" aria-labelledby="kviz-title" className={cn(styles.issue, TONE.berry)}>
      <div className={styles.grid}>
        <Panel span={6} tone="berry" as="div">
          <div className={cn(styles.issueCover, styles.speed)} style={{ minHeight: 0, paddingBottom: 18 }}>
            <div>
              <span className={styles.issueNo}>Bonus</span>
              <h2 id="kviz-title" className={styles.issueTitle}>
                Co by na to řekl pan Guth?
              </h2>
              <p className={styles.issueBlurb}>
                Jiří Guth-Jarkovský napsal Společenský katechismus – knihu o slušném chování. Vyberte, co byste udělali, a
                uvidíte, co na to on.
              </p>
            </div>
          </div>
        </Panel>
        <Panel span={6} tone="sun" as="div">
          <Body>
            <EtiquetteQuiz />
            <noscript>
              <p className={styles.caption}>
                <span className={styles.captionLabel}>Správné odpovědi podle Společenského katechismu</span>{' '}
                {ETIQUETTE_RULES.map((r) => (
                  <q key={r} className={styles.quote} style={{ display: 'block' }}>
                    {r}
                  </q>
                ))}
              </p>
            </noscript>
          </Body>
        </Panel>
      </div>
    </section>
  )
}

export function ComicBook() {
  return (
    <ComicStage>
      <div className={styles.wrap}>
        <Cover />
        <Issue1 />
        <Issue2 />
        <Issue3 />
        <Issue4 />
        <Quiz />
        <p className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="/historie/" className="btn bg-sun">
            <span aria-hidden>←</span> Zpět na Historii školy
          </Link>
          <a href="#obsah" className="btn bg-paper">
            Znovu od začátku <span aria-hidden>↑</span>
          </a>
        </p>
      </div>
    </ComicStage>
  )
}
