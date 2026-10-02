'use client'

import { useRef, useState, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import { cn } from '@/lib/utils'
import { ETIQUETTE_RULES } from '../story'
import { Guth, type GuthMood } from './guth'
import styles from './comic.module.css'

type Option = { text: string; reply: string; mood: GuthMood }
type Situation = { title: string; scene: string; options: Option[]; correct: number; rule: string }

/**
 * "Co by na to řekl pan Guth?" - three everyday situations, each resolved by
 * a real (verified) quote from his Společenský katechismus (ETIQUETTE_RULES).
 * The framing and Guth's reactions are our own; the rule is his.
 */
const SITUATIONS: Situation[] = [
  {
    title: 'Ráno na náměstí',
    scene: 'Cestou do školy potkáš paní učitelku. Kdo má pozdravit jako první?',
    options: [
      { text: 'Paní učitelka – je přece důležitější.', reply: 'Kdepak, mladý příteli! Tak to opravdu nechodí.', mood: 'wow' },
      { text: 'Já, protože jsem mladší.', reply: 'Výborně! Smekám klobouk.', mood: 'smile' },
      { text: 'Ten, kdo má zrovna volnou ruku.', reply: 'Hm… tohle pravidlo v žádné mé knížce nenajdete.', mood: 'sad' }
    ],
    correct: 1,
    rule: ETIQUETTE_RULES[0]
  },
  {
    title: 'Ve školní jídelně',
    scene: 'Máš plnou pusu knedlíku a kamarád se tě zeptá, jak dopadl včerejší zápas.',
    options: [
      { text: 'Odpovím hned – s plnou pusou, ať to stihnu.', reply: 'Ojoj! Ten knedlík by mohl vyletět jako olympijský disk!', mood: 'wow' },
      { text: 'Sním to za pět vteřin a pak všechno vyklopím.', reply: 'Pomalu, pomalu! Oběd není závod – ani olympijský.', mood: 'sad' },
      { text: 'V klidu dojím sousto, polknu a pak povídám.', reply: 'Přesně tak! Nejdřív polknout, pak vyprávět.', mood: 'smile' }
    ],
    correct: 2,
    rule: ETIQUETTE_RULES[1]
  },
  {
    title: 'Přestávka na hřišti',
    scene: 'Kopneš do míče a… CINK! Prasklé okno. Nikdo se zrovna nedíval.',
    options: [
      { text: 'Půjdu to říct paní učitelce.', reply: 'Bravo! Na tohle je potřeba víc odvahy než na olympiádu.', mood: 'smile' },
      { text: 'Rychle zmizím, nikdo nic neviděl.', reply: 'Ach jo. Tohle by pan ceremoniář vidět nechtěl.', mood: 'sad' },
      { text: 'Řeknu, že to byl vítr.', reply: 'Vítr, který kope do míče? To by byl ale sportovec!', mood: 'wow' }
    ],
    correct: 0,
    rule: ETIQUETTE_RULES[2]
  }
]

const KEYS = ['A', 'B', 'C']

export function EtiquetteQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() => SITUATIONS.map(() => null))
  const titleRef = useRef<HTMLHeadingElement>(null)

  const done = step >= SITUATIONS.length
  const score = answers.filter((a, i) => a === SITUATIONS[i].correct).length
  const current = done ? null : SITUATIONS[step]
  const picked = done ? null : answers[step]
  const answered = picked !== null

  const mood: GuthMood = done ? (score >= 2 ? 'smile' : 'wink') : answered && current ? current.options[picked].mood : 'talk'
  const tip = done ? score >= 2 : answered && current !== null && picked === current.correct

  function choose(i: number) {
    if (answered) {
      return
    }
    setAnswers((prev) => prev.map((a, idx) => (idx === step ? i : a)))
  }

  function go(next: number, reset?: boolean) {
    flushSync(() => {
      if (reset) {
        setAnswers(SITUATIONS.map(() => null))
      }
      setStep(next)
    })
    titleRef.current?.focus()
  }

  return (
    <div className={styles.quiz}>
      <div className={styles.quizHost}>
        <p aria-live="polite" className={cn(styles.bubble, styles.tailBl)} style={{ '--origin': '15% 110%' } as CSSProperties}>
          <span className={styles.who}>Pan Guth:</span>
          {done
            ? score === 3
              ? 'Tři ze tří! S takovým chováním byste mohli hned zítra na Hrad.'
              : score === 2
                ? 'Dvě ze tří – to je velmi slušné! A ta třetí? Příště.'
                : 'Nevadí! Já se taky dlouho učil – a koktání jsem se zbavil až ve čtyřiceti.'
            : current && answered
              ? current.options[picked].reply
              : 'Hm, hm… A jak byste to udělali vy?'}
        </p>
        <Guth variant="gent" mood={mood} tip={tip} bob />
        <ol className={styles.progress} aria-label="Postup kvízem">
          {SITUATIONS.map((s, i) => {
            const a = answers[i]
            const state = a === null ? (i === step ? 'právě teď' : 'čeká') : a === s.correct ? 'správně' : 'vedle'
            return (
              <li
                key={s.title}
                className={cn(a !== null && (a === s.correct ? styles.pDone : styles.pMiss), a === null && i === step && styles.pNow)}
              >
                <span className="sr-only">
                  Situace {i + 1}: {state}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <div>
        {current ? (
          <div role="group" aria-labelledby="v2-quiz-title" className={styles.situation}>
            <h3 id="v2-quiz-title" ref={titleRef} tabIndex={-1} className={styles.situationTitle}>
              Situace {step + 1} ze {SITUATIONS.length}: {current.title}
            </h3>
            <p className="m-0 text-lg font-semibold">{current.scene}</p>
            <ul className={styles.options}>
              {current.options.map((o, i) => {
                const isPicked = picked === i
                const isRight = i === current.correct
                return (
                  <li key={o.text}>
                    <button
                      type="button"
                      onClick={() => choose(i)}
                      aria-disabled={answered || undefined}
                      aria-pressed={isPicked}
                      className={cn(
                        styles.option,
                        answered && isRight && styles.optionRight,
                        answered && isPicked && !isRight && styles.optionWrong,
                        answered && !isPicked && !isRight && styles.optionDim
                      )}
                    >
                      <span className={styles.optionKey} aria-hidden>
                        {KEYS[i]}
                      </span>
                      <span>
                        {o.text}
                        {answered && isRight && <span className="sr-only"> (správná odpověď)</span>}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          <div>
            <h3 ref={titleRef} tabIndex={-1} className={styles.situationTitle}>
              Hotovo! {score} ze {SITUATIONS.length} správně
            </h3>
          </div>
        )}

        <div aria-live="polite" className="mt-5 flex flex-col gap-3">
          {current && answered && (
            <p className={styles.caption}>
              <span className={styles.captionLabel}>Společenský katechismus říká</span>{' '}
              <q className={styles.quote}>{current.rule}</q>
            </p>
          )}
          {done && (
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {SITUATIONS.map((s) => (
                <li key={s.title} className={styles.caption}>
                  <span className={styles.captionLabel}>{s.title}</span> <q className={styles.quote}>{s.rule}</q>
                </li>
              ))}
            </ul>
          )}
        </div>

        {current && answered && (
          <button type="button" className={cn('btn', styles.quizBtn)} onClick={() => go(step + 1)}>
            {step + 1 < SITUATIONS.length ? 'Další situace →' : 'Jak jsem dopadl?'}
          </button>
        )}
        {done && (
          <button type="button" className={cn('btn', styles.quizBtn)} onClick={() => go(0, true)}>
            Zkusit znovu
          </button>
        )}
      </div>
    </div>
  )
}
