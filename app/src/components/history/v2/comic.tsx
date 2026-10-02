import { Fragment, type CSSProperties, type ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { CHAPTERS, type Chapter, type Photo } from '../story'
import styles from './comic.module.css'

/** Comic primitives for /historie-2/. All server components. */

export type Tone = 'sun' | 'sky' | 'berry' | 'grape' | 'grass' | 'tangerine'

export const TONE: Record<Tone, string> = {
  sun: styles.toneSun,
  sky: styles.toneSky,
  berry: styles.toneBerry,
  grape: styles.toneGrape,
  grass: styles.toneGrass,
  tangerine: styles.toneTangerine
}

export function chapter(id: string): Chapter {
  const found = CHAPTERS.find((c) => c.id === id)
  if (!found) {
    throw new Error(`Unknown history chapter "${id}"`)
  }
  return found
}

type Span = 2 | 3 | 4 | 6
const SPAN: Record<Span, string> = { 2: styles.s2, 3: styles.s3, 4: styles.s4, 6: styles.s6 }

type PanelProps = {
  span: Span
  tone?: Tone
  /** Resting tilt in degrees. */
  tilt?: number
  /** Tilt the panel flies in from. */
  tiltIn?: number
  id?: string
  className?: string
  children: ReactNode
  /** Accessible label for the panel region (defaults to none - a heading inside names it). */
  labelledBy?: string
  /** `div` for supporting panels that continue the previous chapter. */
  as?: 'article' | 'div'
  /** Art beside the text from md up. */
  row?: boolean
}

/** One comic panel. `data-panel` hooks it into <ComicStage>'s pop-in. */
export function Panel({ span, tone, tilt = 0, tiltIn, id, className, children, labelledBy, as: Tag = 'article', row }: PanelProps) {
  const style = { '--tilt': `${tilt}deg`, '--tilt-in': `${tiltIn ?? (tilt <= 0 ? 6 : -6)}deg` } as CSSProperties
  return (
    <Tag
      id={id}
      data-panel
      aria-labelledby={labelledBy}
      className={cn(styles.panel, SPAN[span], tone && TONE[tone], row && styles.row, className)}
      style={style}
    >
      {children}
    </Tag>
  )
}

/** Decorative art area at the top of a panel. */
export function Art({
  children,
  ratio,
  className,
  decorative = true
}: {
  children: ReactNode
  ratio?: string
  className?: string
  /** False when it contains a real (alt-texted) photo. */
  decorative?: boolean
}) {
  return (
    <div
      aria-hidden={decorative || undefined}
      className={cn(styles.art, className)}
      style={ratio ? ({ '--ratio': ratio } as CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}

export function Body({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(styles.body, className)}>{children}</div>
}

/** Panel heading: "1519 · Kdo se k nim dá…" (year also shown in the starburst). */
export function Head({ ch, id, as: Tag = 'h3' }: { ch: Chapter; id?: string; as?: 'h3' | 'h4' }) {
  return (
    <Tag id={id ?? `ch-${ch.id}`} className={styles.head}>
      <span className={styles.headYear}>{ch.year}</span>
      <span>{ch.title}</span>
    </Tag>
  )
}

function burstPoints(n: number, outer: number, inner: number): string {
  const pts: string[] = []
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    // Slight irregularity so it looks hand-inked.
    const jitter = i % 2 === 0 ? (i % 4 === 0 ? 0 : -3) : 0
    const a = (Math.PI * i) / n - Math.PI / 2
    pts.push(`${(50 + (r + jitter) * Math.cos(a)).toFixed(1)},${(50 + (r + jitter) * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

const BURST = burstPoints(14, 48, 34)

/** Year in a starburst badge (decorative - the year is also in the heading). */
export function Burst({ children, right, color = '#ffcf33', className }: { children: ReactNode; right?: boolean; color?: string; className?: string }) {
  const long = typeof children === 'string' && children.length > 5
  return (
    <div aria-hidden className={cn(styles.burst, right && styles.burstRight, long && styles.burstSmall, className)}>
      <svg viewBox="0 0 100 100">
        <polygon points={BURST} fill={color} stroke="#1d2150" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <span className={styles.burstText}>{children}</span>
    </div>
  )
}

/** Yellow narrative caption box. */
export function Caption({ label, children, className }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn(styles.caption, className)}>
      {label && <span className={styles.captionLabel}>{label}</span>}
      {children}
    </p>
  )
}

/** Renders a chapter's paragraphs as caption boxes (first one labelled). */
export function Captions({ ch, label, from = 0, to }: { ch: Chapter; label?: string; from?: number; to?: number }) {
  return (
    <>
      {ch.text.slice(from, to).map((t, i) => (
        <Caption key={i} label={i === 0 ? label : undefined}>
          {t}
        </Caption>
      ))}
    </>
  )
}

export function Fun({ children }: { children: ReactNode }) {
  return (
    <p className={styles.fun}>
      <span className={styles.funLabel}>Víte, že…? </span>
      {children}
    </p>
  )
}

type Tail = 'bl' | 'br' | 'tl' | 'tr' | 'l'
const TAIL: Record<Tail, string> = { bl: styles.tailBl, br: styles.tailBr, tl: styles.tailTl, tr: styles.tailTr, l: styles.tailL }

type BubbleProps = {
  /** Speaker, announced to screen readers and shown as a tiny label. */
  who: string
  children: ReactNode
  tail?: Tail
  thought?: boolean
  /** Absolutely positioned over the art (top of panel), via `style`. */
  float?: boolean
  showWho?: boolean
  className?: string
  style?: CSSProperties
}

export function Bubble({ who, children, tail = 'bl', thought, float, showWho = false, className, style }: BubbleProps) {
  return (
    <p
      className={cn(styles.bubble, thought ? styles.thought : TAIL[tail], float && styles.float, className)}
      style={style}
    >
      <span className={showWho ? styles.who : 'sr-only'}>{thought ? `${who} si myslí:` : `${who}:`} </span>
      {children}
    </p>
  )
}

/** Onomatopoeia lettering - decorative. */
export function Sfx({
  children,
  color,
  rotate = -8,
  size,
  className,
  style
}: {
  children: ReactNode
  color?: string
  rotate?: number
  size?: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      aria-hidden
      className={cn(styles.sfx, className)}
      style={{ '--sfx': color, '--r': `${rotate}deg`, '--size': size, ...style } as CSSProperties}
    >
      {children}
    </span>
  )
}

/** Key line "typed in" word by word once its panel pops in. Text is always in the DOM. */
export function Typed({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className={styles.w} style={{ '--i': i } as CSSProperties}>
            {w}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </>
  )
}

/** Archival photo with a duotone + halftone comic treatment. */
export function ComicPhoto({
  photo,
  caption = true,
  position,
  className,
  sizes = '(min-width: 882px) 560px, 100vw'
}: {
  photo: Photo
  caption?: boolean
  position?: string
  className?: string
  sizes?: string
}) {
  return (
    <figure className={cn(styles.photo, className)}>
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} style={position ? { objectPosition: position } : undefined} />
      {(caption || photo.credit) && (
        <figcaption className={styles.photoCap}>
          {caption && photo.caption}
          {photo.credit && (
            <small className={styles.credit}>
              {photo.credit}
              {' (barevně upraveno)'}
            </small>
          )}
        </figcaption>
      )}
    </figure>
  )
}

export { styles }
