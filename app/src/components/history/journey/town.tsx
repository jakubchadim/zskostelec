import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { LAST_STEP, stepOf, stepOfId } from './steps'
import css from './journey.module.css'

/*
 * The hand-drawn town of Kostelec that grows chapter by chapter. A plain
 * server-rendered SVG (viewBox 1000x800): each piece is wrapped in <Show>
 * with the step it appears at, and CSS (journey.module.css) turns the
 * stage's --step into opacity/pop-up transforms. No client JS in here.
 */

const INK = '#1d2150'
const C = {
  paper: '#fffdf8',
  cream: '#fff9f0',
  sun: '#ffcf33',
  sunTint: '#fff4c7',
  tangerine: '#ff8a00',
  tangerineTint: '#ffe6c7',
  berry: '#ff5c8a',
  berryTint: '#ffe0ea',
  sky: '#3a9bff',
  skyTint: '#dcedff',
  grass: '#2fbf71',
  grassTint: '#d8f5e4',
  grape: '#8a5cf6',
  grapeTint: '#ece4ff',
  teal: '#0e9f8e',
  sand: '#f7efe3',
  stone: '#d9ccb8',
  skin: '#ffd9b0'
}

const line = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinejoin: 'round',
  strokeLinecap: 'round'
} as const
const thin = {
  stroke: INK,
  strokeWidth: 2,
  strokeLinejoin: 'round',
  strokeLinecap: 'round'
} as const

type ShowProps = {
  from: number
  until?: number
  /** Entrance: pop up from the ground (default), drop in from the sky, or just fade. */
  enter?: 'pop' | 'drop' | 'fade'
  className?: string
  style?: CSSProperties
  children: ReactNode
}

function Show({ from, until, enter = 'pop', className, style, children }: ShowProps) {
  const vars = {
    '--from': from,
    ...(until !== undefined ? { '--until': until } : {}),
    ...style
  } as CSSProperties
  return (
    <g className={cn(css.el, enter === 'pop' && css.pop, enter === 'drop' && css.drop, className)} style={vars}>
      {children}
    </g>
  )
}

/* ------------------------------------------------------------ helpers */

function Windows({
  x,
  y,
  cols,
  rows,
  w = 12,
  h = 16,
  gapX,
  gapY = 10,
  arch
}: {
  x: number
  y: number
  cols: number
  rows: number
  w?: number
  h?: number
  gapX: number
  gapY?: number
  arch?: boolean
}) {
  const out: ReactNode[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = x + c * (w + gapX)
      const wy = y + r * (h + gapY)
      out.push(
        arch ? (
          <path
            key={`${r}-${c}`}
            className={css.win}
            d={`M${wx} ${wy + h}V${wy + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${wy + h}Z`}
            {...thin}
          />
        ) : (
          <rect key={`${r}-${c}`} className={css.win} x={wx} y={wy} width={w} height={h} rx="2" {...thin} />
        )
      )
    }
  }
  return <>{out}</>
}

/** Gable roof seen from the side (a trapezoid). */
function Roof({
  x,
  y,
  w,
  h,
  fill,
  overhang = 7
}: {
  x: number
  y: number
  w: number
  h: number
  fill: string
  overhang?: number
}) {
  return <path d={`M${x - overhang} ${y}L${x + 12} ${y - h}H${x + w - 12}L${x + w + overhang} ${y}Z`} fill={fill} {...line} />
}

function Door({ x, y, w = 14, h = 20, fill = C.tangerine }: { x: number; y: number; w?: number; h?: number; fill?: string }) {
  return <path d={`M${x} ${y}V${y - h + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${y}Z`} fill={fill} {...thin} />
}

/** Tiny cartoon person: head, body, legs. `hat` and `glasses` for the characters. */
function Person({
  x,
  y,
  body,
  scale = 1,
  hair = INK,
  glasses,
  hat,
  flip
}: {
  x: number
  y: number
  body: string
  scale?: number
  hair?: string
  glasses?: boolean
  hat?: string
  flip?: boolean
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <path d="M-5 0V-12M5 0V-12" {...thin} strokeWidth={3} />
      <path d="M-10 -10Q-10 -30 0 -30Q10 -30 10 -10Z" fill={body} {...thin} />
      <circle cx="0" cy="-38" r="9" fill={C.skin} {...thin} />
      <path d="M-9 -40Q-8 -49 0 -48Q8 -49 9 -40Q4 -44 -9 -40Z" fill={hair} {...thin} strokeWidth={1.5} />
      {glasses && (
        <g fill="none" stroke={INK} strokeWidth="1.6">
          <circle cx="-3.5" cy="-38" r="3" fill={C.cream} />
          <circle cx="4" cy="-38" r="3" fill={C.cream} />
        </g>
      )}
      {hat && (
        <g>
          <path d="M-7 -45L-6 -56H6L7 -45Z" fill={hat} {...thin} />
          <path d="M-12 -45H12" {...thin} strokeWidth={3} />
        </g>
      )}
    </g>
  )
}

/** A little floating label tag ("Praha", "Potštejn"...). */
function Tag({ x, y, children, fill = C.paper }: { x: number; y: number; children: string; fill?: string }) {
  const w = children.length * 8.6 + 18
  return (
    <g transform={`translate(${x} ${y}) rotate(-3)`}>
      <rect x={-w / 2} y="-13" width={w} height="24" rx="12" fill={fill} {...thin} />
      <text y="4" textAnchor="middle" fontSize="14" fontWeight="700" fill={INK} style={{ fontFamily: 'var(--font-display)' }}>
        {children}
      </text>
    </g>
  )
}

function Sparkle4({ x, y, r = 8, className }: { x: number; y: number; r?: number; className?: string }) {
  return (
    <path
      className={className}
      d={`M${x} ${y - r}Q${x + r * 0.15} ${y - r * 0.15} ${x + r} ${y}Q${x + r * 0.15} ${y + r * 0.15} ${x} ${y + r}Q${x - r * 0.15} ${y + r * 0.15} ${x - r} ${y}Q${x - r * 0.15} ${y - r * 0.15} ${x} ${y - r}Z`}
      fill={C.sun}
      stroke={INK}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  )
}

/* ------------------------------------------------------------- pieces */

function Sky() {
  const day = stepOf('lhota')
  const afternoon = stepOf('realka')
  const dusk = stepOf('today')
  return (
    <g>
      <defs>
        <linearGradient id="v1-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b8a4f2" />
          <stop offset="0.5" stopColor="#ffc3b4" />
          <stop offset="0.75" stopColor="#ffe3c2" />
        </linearGradient>
        <linearGradient id="v1-morning" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9d6ff" />
          <stop offset="0.7" stopColor="#fff2cf" />
        </linearGradient>
        <linearGradient id="v1-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#74baff" />
          <stop offset="0.7" stopColor="#dcedff" />
        </linearGradient>
        <linearGradient id="v1-afternoon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#86c2ff" />
          <stop offset="0.7" stopColor="#fff0bf" />
        </linearGradient>
        <linearGradient id="v1-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c3d9e" />
          <stop offset="0.35" stopColor="#9a5cc4" />
          <stop offset="0.58" stopColor="#ff8fa3" />
          <stop offset="0.75" stopColor="#ffc46b" />
        </linearGradient>
      </defs>
      <rect x="-600" y="-500" width="2200" height="1500" fill="url(#v1-dawn)" />
      <Show from={1} enter="fade">
        <rect x="-600" y="-500" width="2200" height="1500" fill="url(#v1-morning)" />
      </Show>
      <Show from={day} enter="fade">
        <rect x="-600" y="-500" width="2200" height="1500" fill="url(#v1-day)" />
      </Show>
      <Show from={afternoon} enter="fade">
        <rect x="-600" y="-500" width="2200" height="1500" fill="url(#v1-afternoon)" />
      </Show>
      <Show from={dusk} enter="fade">
        <rect x="-600" y="-500" width="2200" height="1500" fill="url(#v1-dusk)" />
        {[
          [90, 80, 7],
          [210, 150, 5],
          [330, 60, 8],
          [620, 110, 6],
          [720, 50, 5],
          [930, 130, 7],
          [860, 40, 5],
          [460, 170, 4]
        ].map(([x, y, r], i) => (
          <g key={i} className={css.twinkle} style={{ animationDelay: `${i * -0.37}s` }}>
            <Sparkle4 x={x} y={y} r={r} />
          </g>
        ))}
      </Show>
    </g>
  )
}

function SunOnArc() {
  return (
    <g className={css.sunArm}>
      <g className={css.sunFace}>
        <g stroke={INK} strokeWidth="3" strokeLinecap="round">
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI * 2) / 12
            return (
              <line
                key={i}
                x1={(500 + Math.cos(a) * 46).toFixed(1)}
                y1={(240 + Math.sin(a) * 46).toFixed(1)}
                x2={(500 + Math.cos(a) * 60).toFixed(1)}
                y2={(240 + Math.sin(a) * 60).toFixed(1)}
              />
            )
          })}
        </g>
        <circle className={css.sunDisc} cx="500" cy="240" r="34" stroke={INK} strokeWidth="3" />
        <circle cx="489" cy="234" r="3" fill={INK} />
        <circle cx="511" cy="234" r="3" fill={INK} />
        <path d="M488 248q12 10 24 0" fill="none" {...line} />
        <circle cx="481" cy="246" r="4" fill={C.berry} opacity="0.45" />
        <circle cx="519" cy="246" r="4" fill={C.berry} opacity="0.45" />
      </g>
    </g>
  )
}

function Clouds() {
  const cloud = 'M28 56h66a20 20 0 002-40 26 26 0 00-48-6 18 18 0 00-26 14A16 16 0 0028 56z'
  return (
    <g aria-hidden>
      {[
        { y: 70, s: 1, d: 70, delay: -20 },
        { y: 170, s: 0.7, d: 95, delay: -70 },
        { y: 120, s: 0.85, d: 120, delay: -40 }
      ].map((c, i) => (
        <g
          key={i}
          className={css.cloud}
          style={{
            animationDuration: `${c.d}s`,
            animationDelay: `${c.delay}s`
          }}
        >
          <path d={cloud} transform={`translate(0 ${c.y}) scale(${c.s})`} fill="#ffffff" fillOpacity="0.92" {...line} />
        </g>
      ))}
    </g>
  )
}

function Balloon() {
  const rings: [number, number, string][] = [
    [-22, -6, '#0085c7'],
    [0, -6, INK],
    [22, -6, '#ee334e'],
    [-11, 4, '#fcb131'],
    [11, 4, '#00a651']
  ]
  return (
    <Show from={stepOf('olympics')} enter="drop">
      <g className={css.bob}>
        <g transform="translate(330 175)">
          <path d="M-14 72L-8 98M14 72L8 98" {...thin} />
          <rect x="-12" y="96" width="24" height="18" rx="3" fill={C.tangerine} {...line} />
          <path
            d="M0 -70C42 -70 62 -40 58 -6C54 26 26 52 14 72H-14C-26 52 -54 26 -58 -6C-62 -40 -42 -70 0 -70Z"
            fill={C.paper}
            {...line}
          />
          <path d="M0 -70C-20 -40 -20 40 -8 72M0 -70C20 -40 20 40 8 72" fill="none" {...thin} strokeOpacity="0.35" />
          {rings.map(([x, y, color], i) => (
            <circle key={i} cx={x} cy={y} r="10" fill="none" stroke={color} strokeWidth="4" />
          ))}
          <Person x={0} y={106} body={C.sky} scale={0.5} glasses />
        </g>
      </g>
      <Tag x={420} y={300} fill={C.sunTint}>
        Paříž 1894
      </Tag>
    </Show>
  )
}

function FarHills() {
  return (
    <g>
      <path
        d="M-600 530L0 515C70 480 170 455 280 485C380 512 460 470 590 478C700 485 790 440 900 455C960 463 1000 480 1600 500V1200H-600Z"
        fill="#cdebd5"
        stroke={INK}
        strokeOpacity="0.45"
        strokeWidth="2.5"
      />
      {/* Prague Castle, far far away (1919). */}
      <Show from={stepOf('castle')}>
        <g fill={C.grapeTint} stroke={INK} strokeOpacity="0.7" strokeWidth="2" strokeLinejoin="round">
          <path d="M180 482V462H240V452H262V462H330V482Z" />
          <path d="M262 452L270 412L278 452Z" />
          <path d="M284 462V436H306V462Z" />
          <path d="M284 436L290 400L295 436ZM296 436L301 404L306 436Z" />
          <path d="M248 452V440H258V452Z" />
          <path d="M200 462L206 448L212 462Z" />
        </g>
        <path d="M288 400v-8M298 404v-8" stroke={INK} strokeOpacity="0.7" strokeWidth="2" />
        <Tag x={255} y={380} fill={C.grapeTint}>
          Praha
        </Tag>
      </Show>
      {/* Potštejn castle ruin at the end of the red trail (1921). */}
      <Show from={stepOf('trail')}>
        <g transform="translate(-290 22)" fill={C.stone} stroke={INK} strokeOpacity="0.8" strokeWidth="2" strokeLinejoin="round">
          <path d="M886 458V428L890 424L894 428L898 422L902 428L906 424V458Z" />
          <path d="M906 458V442H928L932 436L936 442V458Z" />
        </g>
        <Tag x={624} y={428}>
          Potštejn
        </Tag>
      </Show>
    </g>
  )
}

/** Lollipop trees and a little flock of birds - there from the very first dawn. */
function Nature() {
  const trees: [number, number, number, string][] = [
    [22, 600, 1, C.grass],
    [48, 610, 0.8, '#5fcf8f'],
    [262, 604, 0.9, '#5fcf8f'],
    [292, 612, 0.7, C.grass],
    [968, 612, 0.9, C.grass],
    [30, 716, 1.2, C.grass],
    [972, 718, 1.1, '#5fcf8f']
  ]
  return (
    <g>
      {trees.map(([x, y, scale, color], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${scale})`}>
          <path d="M0 0V-22" {...line} strokeWidth={4} />
          <path d="M0 0V-22" stroke="#c98a4b" strokeWidth="2" />
          <circle cx="0" cy="-34" r="16" fill={color} {...line} />
          <path
            d="M-6 -40a7 7 0 0 1 8 -4"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  )
}

function Birds() {
  return (
    <g className={css.flock}>
      {[
        [0, 300],
        [26, 290],
        [44, 306]
      ].map(([x, y], i) => (
        <path
          key={i}
          className={css.bird}
          style={{ animationDelay: `${i * 0.2}s` }}
          d={`M${x} ${y}q7 -8 12 0q5 -8 12 0`}
          fill="none"
          {...thin}
          strokeWidth={2.5}
        />
      ))}
    </g>
  )
}

function MidHills() {
  return (
    <path
      d="M-600 600L-20 590C20 560 60 528 110 530C170 532 200 575 280 595C420 625 600 606 760 590C820 584 860 548 910 548C960 548 990 575 1600 595V1200H-600Z"
      fill="#bfe7c8"
      {...line}
    />
  )
}

function Trail() {
  return (
    <Show from={stepOf('trail')} enter="fade">
      <path
        d="M786 690C800 664 840 650 860 622C880 594 700 520 616 480"
        fill="none"
        stroke="#ee334e"
        strokeWidth="4"
        strokeDasharray="10 9"
        strokeLinecap="round"
      />
    </Show>
  )
}

/* Back row (baseline ~632, bottoms tucked behind the ground line). */

function Lhota() {
  return (
    <Show from={stepOf('lhota')}>
      <g>
        <rect x="70" y="502" width="74" height="36" fill={C.sunTint} {...line} />
        <Roof x={70} y={502} w={74} h={22} fill={C.tangerine} />
        <path d="M100 480V468H114V480" fill={C.paper} {...thin} />
        <path d="M97 468L107 456L117 468Z" fill={C.tangerine} {...thin} />
        {/* 50-60 children in one classroom: a window crammed with heads. */}
        <rect x="78" y="508" width="40" height="22" rx="2" className={css.win} {...thin} />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={84 + i * 7} cy={522} r="3.6" fill={C.skin} stroke={INK} strokeWidth="1.2" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={87.5 + i * 7} cy={515} r="3.2" fill={C.skin} stroke={INK} strokeWidth="1.2" />
        ))}
        <Door x={124} y={538} w={12} h={18} />
      </g>
      <Tag x={107} y={432} fill={C.sunTint}>
        Kostelecká Lhota
      </Tag>
    </Show>
  )
}

function Brethren() {
  return (
    <Show from={stepOf('brethren')}>
      <rect x="330" y="582" width="58" height="56" fill={C.tangerineTint} {...line} />
      <path d="M330 600H388M330 620H388M345 582V638M373 582V638M330 582L345 600M388 582L373 600" {...thin} />
      <Roof x={330} y={582} w={58} h={30} fill={C.berry} />
      <Door x={352} y={636} w={14} h={16} fill={C.grape} />
      {/* Open book sign. */}
      <g transform="translate(359 566)">
        <path d="M-12 -4Q-6 -8 0 -4Q6 -8 12 -4V6Q6 2 0 6Q-6 2 -12 6Z" fill={C.paper} {...thin} />
        <path d="M0 -4V6" {...thin} />
      </g>
    </Show>
  )
}

function BrethrenLetters() {
  const s = stepOf('brethren')
  return (
    <Show from={s} until={s} enter="drop">
      {['A', 'B', 'C'].map((letter, i) => (
        <text
          key={letter}
          x={330 + i * 26}
          y={530 - (i % 2) * 14}
          fontSize="26"
          fontWeight="800"
          fill={[C.berry, C.sky, C.grass][i]}
          stroke={INK}
          strokeWidth="1.4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {letter}
        </text>
      ))}
    </Show>
  )
}

function FirstSchool() {
  return (
    <Show from={stepOf('firstSchool')}>
      <rect x="396" y="560" width="72" height="78" fill={C.sunTint} {...line} />
      <Roof x={396} y={560} w={72} h={24} fill={C.tangerine} />
      <path d="M410 542V532H418V540" fill={C.paper} {...thin} />
      <Windows x={404} y={570} cols={3} rows={2} w={11} h={14} gapX={11} gapY={12} />
      <Door x={425} y={638} w={13} h={14} />
    </Show>
  )
}

function Church() {
  const cantor = stepOf('cantor')
  return (
    <Show from={stepOf('church')}>
      {/* Nave */}
      <rect x="490" y="566" width="126" height="72" fill={C.paper} {...line} />
      <Roof x={490} y={566} w={126} h={30} fill={C.teal} />
      <Windows x={540} y={580} cols={3} rows={1} w={13} h={26} gapX={13} arch />
      {/* Tower */}
      <rect x="474" y="452" width="50" height="186" fill={C.paper} {...line} />
      <path d="M474 476H524M474 530H524" {...thin} />
      <path d="M470 452C470 436 486 428 499 428C512 428 528 436 528 452Z" fill={C.teal} {...line} />
      <path d="M488 430C488 414 494 404 499 396C504 404 510 414 510 430" fill={C.teal} {...line} />
      <path d="M499 396V372M491 382H507" {...line} />
      <circle cx="499" cy="460" r="0" />
      <circle cx="499" cy="503" r="13" fill={C.cream} {...line} />
      <path d="M499 503V495M499 503L505 507" {...thin} />
      <Door x={490} y={638} w={18} h={26} fill={C.grape} />
      {/* Belfry window with the bell (rings on in the cantor chapter). */}
      <path d="M488 476V466a11 11 0 0 1 22 0V476Z" fill="#3d3f63" {...thin} />
      <Show from={1} until={cantor - 1} enter="fade">
        <path d="M493 474Q493 464 499 464Q505 464 505 474Z" fill={C.sun} {...thin} />
      </Show>
      <Show from={cantor} enter="fade">
        <g className={css.swing}>
          <path d="M493 474Q493 464 499 464Q505 464 505 474Z" fill={C.sun} {...thin} />
        </g>
      </Show>
    </Show>
  )
}

function Fara() {
  return (
    <Show from={stepOf('church')}>
      <rect x="628" y="590" width="66" height="48" fill={C.grapeTint} {...line} />
      <Roof x={628} y={590} w={66} h={24} fill={C.tangerine} />
      <Windows x={638} y={600} cols={2} rows={1} w={12} h={14} gapX={22} />
      <Door x={654} y={638} w={14} h={16} />
    </Show>
  )
}

function Cantor() {
  const s = stepOf('cantor')
  return (
    <Show from={s} until={s} enter="fade">
      {/* Notes floating out of the belfry - cantare = to sing. */}
      {[0, 1, 2].map((i) => (
        <g key={i} className={css.note} style={{ animationDelay: `${i * 0.85}s` }}>
          <g transform={`translate(${520 + i * 6} ${470 - i * 4})`}>
            <ellipse cx="0" cy="0" rx="6" ry="4.5" fill={INK} transform="rotate(-20)" />
            <path d="M5 -2V-22L14 -18" fill="none" {...thin} strokeWidth={2.5} />
          </g>
        </g>
      ))}
      {/* A pupil bringing the cantor his "sobotáles": firewood. */}
      <g transform="translate(600 682)">
        <g className={css.hop}>
          <Person x={0} y={0} body={C.grass} scale={0.9} flip />
          <g transform="translate(-14 -30)">
            <rect x="-10" y="-6" width="26" height="7" rx="3.5" fill="#c98a4b" {...thin} />
            <rect x="-6" y="-12" width="24" height="7" rx="3.5" fill="#d99b5c" {...thin} />
          </g>
        </g>
      </g>
      <g transform="translate(556 682)">
        <Person x={0} y={0} body={INK} scale={1.05} hat={INK} />
        <path d="M8 -26L20 -40" {...line} />
        <path d="M14 -42Q20 -50 26 -42L24 -36H16Z" fill={C.sun} {...thin} />
      </g>
    </Show>
  )
}

function TownHall() {
  return (
    <Show from={stepOf('mainSchool')}>
      <rect x="712" y="566" width="84" height="72" fill={C.skyTint} {...line} />
      <path d="M704 566L722 540H786L804 566Z" fill={C.berry} {...line} />
      <rect x="742" y="512" width="24" height="30" fill={C.paper} {...line} />
      <path d="M738 512L754 488L770 512Z" fill={C.teal} {...line} />
      <circle cx="754" cy="527" r="7" fill={C.cream} {...thin} />
      <path d="M754 488V476" {...line} />
      <path d="M754 476L768 480L754 484" fill={C.berry} {...thin} />
      <Windows x={722} y={578} cols={3} rows={2} w={12} h={14} gapX={14} gapY={10} />
      <Door x={746} y={638} w={16} h={14} fill={C.grape} />
    </Show>
  )
}

function SugarFactory() {
  return (
    <Show from={stepOf('square45')}>
      <rect x="868" y="596" width="74" height="42" fill={C.stone} {...line} />
      <path d="M868 596L880 580L892 596L904 580L916 596L928 580L942 596" fill={C.sand} {...line} />
      <path d="M906 596V470H926V596" fill={C.tangerine} {...line} />
      <path d="M906 500H926M906 530H926M906 560H926" {...thin} />
      <rect x="902" y="462" width="28" height="10" rx="2" fill={C.tangerine} {...line} />
      <Windows x={876} y={606} cols={3} rows={1} w={10} h={12} gapX={10} />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          className={css.smoke}
          style={{ animationDelay: `${i * 1.05}s` }}
          cx="916"
          cy="450"
          r="12"
          fill="#ffffff"
          fillOpacity="0.85"
          stroke={INK}
          strokeWidth="2"
        />
      ))}
    </Show>
  )
}

function StAnne() {
  return (
    <Show from={stepOfId('stesk')}>
      <rect x="950" y="516" width="40" height="30" fill={C.paper} {...line} />
      <Roof x={950} y={516} w={40} h={14} fill={C.teal} overhang={4} />
      <rect x="936" y="490" width="18" height="56" fill={C.paper} {...line} />
      <path d="M933 490L945 462L957 490Z" fill={C.teal} {...line} />
      <path d="M945 462V450M940 455H950" {...thin} />
    </Show>
  )
}

/* Ground, square, rail, river. */

function Ground() {
  return (
    <>
      <path d="M-600 632C100 624 300 640 520 634C720 628 860 640 1600 630V1200H-600Z" fill="#a7deb2" {...line} />
      {/* Grass tufts. */}
      <g fill="none" {...thin} strokeOpacity="0.5">
        <path d="M40 668l4-8 4 8M220 660l4-8 4 8M960 668l4-8 4 8M90 760l4-8 4 8M680 760l4-8 4 8M860 752l4-8 4 8" />
      </g>
    </>
  )
}

function Square() {
  return (
    <Show from={stepOf('church')} enter="fade">
      <ellipse cx="500" cy="680" rx="150" ry="22" fill={C.sand} {...line} />
      <g fill={C.stone}>
        {[
          [400, 680],
          [440, 690],
          [470, 674],
          [530, 688],
          [570, 676],
          [600, 686],
          [500, 682]
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" />
        ))}
      </g>
    </Show>
  )
}

function Railway() {
  return (
    <Show from={stepOf('square45')} enter="fade">
      <g {...thin}>
        <path d="M-600 722H1600M-600 732H1600" strokeWidth={2.5} />
        {Array.from({ length: 52 }, (_, i) => (
          <path key={i} d={`M${-20 + i * 22} 718V736`} strokeWidth={2.5} />
        ))}
      </g>
      <g className={css.train}>
        <g transform="translate(0 0)">
          {/* Locomotive */}
          <rect x="0" y="690" width="58" height="30" rx="4" fill={C.berry} {...line} />
          <rect x="34" y="672" width="28" height="22" rx="3" fill={C.berry} {...line} />
          <rect x="40" y="677" width="14" height="10" rx="2" className={css.win} {...thin} />
          <path d="M8 690V670H22V690" fill={INK} {...thin} />
          <path d="M-6 720L4 704V720Z" fill={C.sun} {...thin} />
          <circle cx="15" cy="722" r="7" fill={INK} />
          <circle cx="45" cy="722" r="7" fill={INK} />
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              className={css.smoke}
              style={{
                animationDelay: `${i * 0.6}s`,
                animationDuration: '1.8s'
              }}
              cx="15"
              cy="660"
              r="8"
              fill="#ffffff"
              stroke={INK}
              strokeWidth="1.6"
            />
          ))}
          {/* Wagons */}
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(${70 + i * 66} 0)`}>
              <path d="M-12 708H0" {...thin} />
              <rect x="0" y="692" width="58" height="28" rx="4" fill={i ? C.sky : C.sun} {...line} />
              <rect x="8" y="698" width="16" height="10" rx="2" className={css.win} {...thin} />
              <rect x="32" y="698" width="16" height="10" rx="2" className={css.win} {...thin} />
              <circle cx="14" cy="722" r="6" fill={INK} />
              <circle cx="44" cy="722" r="6" fill={INK} />
            </g>
          ))}
        </g>
      </g>
    </Show>
  )
}

function River() {
  return (
    <g>
      <path d="M-600 772C80 758 300 790 500 776C700 762 850 790 1600 772V1200H-600Z" fill="#8cc8ff" {...line} />
      <g fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.85">
        <path d="M120 788q12-6 24 0t24 0M420 790q12-6 24 0t24 0M760 786q12-6 24 0t24 0" />
      </g>
      <Tag x={590} y={790} fill={C.skyTint}>
        Orlice
      </Tag>
    </g>
  )
}

/* Front row (on the ground, baseline ~690). */

function SquareSchool() {
  return (
    <Show from={stepOf('square45')}>
      <g transform="translate(-34 0)">
        <rect x="268" y="606" width="112" height="86" fill={C.tangerineTint} {...line} />
        <Roof x={268} y={606} w={112} h={26} fill={C.tangerine} />
        <Windows x={278} y={616} cols={4} rows={2} w={13} h={16} gapX={13} gapY={12} />
        <rect x="300" y="660" width="48" height="12" rx="3" fill={C.paper} {...thin} />
        <text
          x="324"
          y="670"
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          fill={INK}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ŠKOLA
        </text>
        <Door x={317} y={692} w={14} h={18} fill={C.grape} />
        <path d="M380 582V560" {...line} />
        <path d="M380 560L398 565L380 571Z" fill={C.berry} {...thin} />
      </g>
    </Show>
  )
}

function Realka() {
  return (
    <Show from={stepOf('realka')}>
      <g transform="translate(-24 0)">
        <rect x="92" y="596" width="148" height="96" fill={C.sunTint} {...line} />
        {/* Art nouveau gable. */}
        <path d="M136 596C136 572 146 560 166 552C186 560 196 572 196 596Z" fill={C.sun} {...line} />
        <circle cx="166" cy="578" r="9" fill={C.paper} {...thin} />
        <path d="M161 578a5 5 0 0 1 10 0" fill="none" {...thin} />
        <path d="M92 596H240" stroke={C.teal} strokeWidth="6" />
        <path d="M92 596H240" {...thin} />
        <path
          d="M100 590Q110 580 120 590M212 590Q222 580 232 590"
          fill="none"
          stroke={C.teal}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Windows x={102} y={608} cols={5} rows={2} w={13} h={20} gapX={15} gapY={12} arch />
        <Door x={158} y={692} w={16} h={22} fill={C.teal} />
      </g>
    </Show>
  )
}

function Skala() {
  return (
    <Show from={stepOf('skala')}>
      <path d="M800 704C798 680 806 660 820 652L860 640L900 650C916 662 920 684 918 704Z" fill={C.stone} {...line} />
      <path d="M826 676l12-8M870 668l14 10M846 690l10-4" {...thin} />
      <rect x="822" y="608" width="74" height="40" fill={C.berryTint} {...line} />
      <Roof x={822} y={608} w={74} h={22} fill={C.grape} />
      <Windows x={830} y={616} cols={3} rows={1} w={11} h={14} gapX={12} />
      <Door x={872} y={648} w={12} h={14} />
    </Show>
  )
}

function TrailMarker() {
  return (
    <Show from={stepOf('trail')}>
      <g transform="translate(86 0)">
        <path d="M700 724V672" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M700 724V672" stroke="#c98a4b" strokeWidth="2.5" strokeLinecap="round" />
        <g transform="translate(686 662)">
          <rect x="0" y="0" width="28" height="24" rx="2" fill="#ffffff" {...thin} />
          <rect x="0" y="8" width="28" height="8" fill="#ee334e" />
          <rect x="0" y="0" width="28" height="24" rx="2" fill="none" {...thin} />
        </g>
      </g>
      <Tag x={850} y={738} fill={C.paper}>
        40 km
      </Tag>
    </Show>
  )
}

function Masaryk() {
  const s = stepOf('masaryk')
  const heads = [
    [410, 700, C.berry],
    [436, 706, C.sky],
    [462, 700, C.grass],
    [520, 702, C.sun],
    [548, 708, C.grape],
    [574, 700, C.tangerine],
    [600, 706, C.teal]
  ] as const
  return (
    <Show from={s} until={s}>
      {/* Bunting */}
      <path d="M380 612Q500 650 620 612" fill="none" {...thin} />
      {Array.from({ length: 9 }, (_, i) => {
        const t = (i + 0.5) / 9
        const x = 380 + 240 * t
        const y = 612 + 4 * 38 * t * (1 - t)
        return (
          <path
            key={i}
            d={`M${x - 8} ${y}L${x + 8} ${y}L${x} ${y + 14}Z`}
            fill={['#ffffff', '#ee334e', '#0085c7'][i % 3]}
            {...thin}
            strokeWidth={1.5}
          />
        )
      })}
      {/* Flag (Czechoslovak) */}
      <path d="M490 704V610" {...line} />
      <g className={css.flag}>
        <path d="M490 612H534V626H490Z" fill="#ffffff" {...thin} />
        <path d="M490 626H534V640H490Z" fill="#ee334e" {...thin} />
        <path d="M490 612L510 626L490 640Z" fill="#0085c7" {...thin} />
      </g>
      {/* The president among the people: tall, white goatee, cap. */}
      <g transform="translate(494 700)">
        <Person x={0} y={0} body="#5b5a6e" scale={1.15} hair={C.paper} hat="#5b5a6e" />
        <path d="M-3 -32Q0 -24 3 -32" fill={C.paper} stroke={INK} strokeWidth="1.4" />
      </g>
      {heads.map(([x, y, color], i) => (
        <g key={i} className={i % 2 ? css.hop : undefined} style={{ animationDelay: `${i * 0.13}s` }}>
          <Person x={x} y={y} body={color} scale={0.8} hair={i % 3 ? INK : '#c98a4b'} />
        </g>
      ))}
    </Show>
  )
}

function DreamSchool() {
  const s = stepOf('dream')
  return (
    <Show from={s} until={s} enter="fade">
      <g fill="#dcedff" fillOpacity="0.88" stroke="#0f5fb3" strokeWidth="2.5" strokeLinejoin="round" className={css.ghost}>
        <rect x="560" y="574" width="210" height="118" />
        <rect x="610" y="540" width="110" height="34" />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={572 + i * 32} y="590" width="24" height="30" fill="none" />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={572 + i * 32} y="634" width="24" height="30" fill="none" />
        ))}
      </g>
      <g transform="translate(784 548) rotate(8)">
        <circle r="22" fill={C.paper} {...line} />
        <text
          y="11"
          textAnchor="middle"
          fontSize="32"
          fontWeight="800"
          fill={C.berry}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ?
        </text>
      </g>
      <Tag x={664} y={520} fill={C.paper}>
        nikdy nepostavena
      </Tag>
    </Show>
  )
}

function TodaySchool() {
  const s = stepOf('today')
  return (
    <Show from={s}>
      <g transform="translate(-22 0)">
        <rect x="580" y="610" width="170" height="82" rx="4" fill={C.paper} {...line} />
        <rect x="580" y="610" width="170" height="14" fill={C.grass} {...line} />
        <rect x="580" y="624" width="26" height="68" fill={C.sun} {...line} />
        <rect x="724" y="624" width="26" height="68" fill={C.berry} {...line} />
        <Windows x={614} y={634} cols={4} rows={2} w={20} h={18} gapX={6} gapY={8} />
        <path d="M650 692V672H680V692" fill={C.sky} {...thin} />
        {/* Flagpole with the school mark. */}
        <path d="M756 692V574" {...line} />
        <g className={css.flag}>
          <rect x="756" y="576" width="40" height="30" rx="3" fill={C.tangerine} {...thin} />
          <circle cx="770" cy="593" r="4.2" fill={C.cream} stroke={INK} strokeWidth="1.8" />
          <circle cx="781" cy="593" r="4.2" fill={C.cream} stroke={INK} strokeWidth="1.8" />
          <path d="M764 584H787L785 580H766Z" fill={INK} />
        </g>
      </g>
    </Show>
  )
}

function Kids() {
  const s = stepOf('today')
  return (
    <Show from={s} enter="drop">
      {[
        [574, 708, C.berry, false, INK],
        [606, 712, C.sky, true, '#c98a4b'],
        [690, 710, C.grass, false, '#f2b33d'],
        [722, 706, C.grape, true, INK]
      ].map(([x, y, color, flip, hair], i) => (
        <g key={i} className={css.hop} style={{ animationDelay: `${i * 0.21}s` }}>
          <Person
            x={x as number}
            y={y as number}
            body={color as string}
            scale={0.85}
            flip={flip as boolean}
            hair={hair as string}
          />
        </g>
      ))}
      <g className={css.ball}>
        <circle cx="634" cy="700" r="9" fill={C.sun} {...line} />
        <path d="M625 700h18" {...thin} />
      </g>
    </Show>
  )
}

function Boy() {
  const arrive = stepOfId('jiri-kluk')
  const walk = stepOfId('stesk')
  return (
    <Show from={arrive} until={walk} enter="drop">
      {/* Walks from the square (1868) out to the field toward Rychnov (1870). */}
      <g className={css.boyTrip} style={{ '--walk-from': walk, '--walk-dx': '360px' } as CSSProperties}>
        <g transform="translate(420 764)">
          <g className={css.hop}>
            <Person x={0} y={0} body={C.sky} scale={1.6} glasses />
            {/* Book in hand. */}
            <g transform="translate(16 -36) rotate(-12)">
              <rect x="0" y="0" width="16" height="20" rx="2" fill={C.berry} {...thin} />
              <path d="M4 0V20" {...thin} strokeWidth={1.5} />
            </g>
          </g>
          {/* Homesick: dreaming of home (1870). */}
          <Show from={walk} until={walk} enter="fade">
            <g transform="translate(0 -14) scale(-1 1)">
              <circle cx="-22" cy="-92" r="4" fill={C.paper} {...thin} />
              <circle cx="-34" cy="-106" r="6" fill={C.paper} {...thin} />
              <path
                d="M-96 -118a16 16 0 0 1 10 -28a20 20 0 0 1 36 -6a16 16 0 0 1 22 18a14 14 0 0 1 -8 26h-48a14 14 0 0 1 -12 -10z"
                fill={C.paper}
                {...line}
              />
              <path d="M-80 -112V-130L-68 -142L-56 -130V-112Z" fill={C.tangerineTint} {...thin} />
              <path
                d="M-84 -128L-68 -144L-52 -128"
                fill="none"
                stroke={C.berry}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M-40 -128c0-5 7-6 8-1c1-5 8-4 8 1c0 5-8 9-8 11c0-2-8-6-8-11z"
                fill={C.berry}
                stroke={INK}
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </g>
          </Show>
        </g>
      </g>
    </Show>
  )
}

/** Opening shot only: a signpost in the empty dawn valley. */
function HeroSign() {
  return (
    <Show from={0} until={0}>
      <path d="M500 760V690" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M500 760V690" stroke="#c98a4b" strokeWidth="3" strokeLinecap="round" />
      <g transform="translate(500 680) rotate(-3)">
        <path d="M-104 -22H96L112 0L96 22H-104Z" fill={C.paper} {...line} />
        <text
          y="7"
          x="-4"
          textAnchor="middle"
          fontSize="20"
          fontWeight="800"
          fill={INK}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Kostelec nad Orlicí
        </text>
      </g>
      <Sparkle4 x={630} y={640} r={10} className={css.twinkle} />
      <Sparkle4 x={378} y={650} r={7} className={css.twinkle} />
    </Show>
  )
}

function RychnovSign() {
  return (
    <Show from={stepOfId('stesk')} until={stepOfId('stesk')}>
      <path d="M960 768V720" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M960 768V720" stroke="#c98a4b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M916 714H982L992 724L982 734H916Z" fill={C.paper} {...thin} />
      <text
        x="950"
        y="729"
        textAnchor="middle"
        fontSize="12"
        fontWeight="800"
        fill={INK}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Rychnov
      </text>
    </Show>
  )
}

/** The whole drawn town. `className` sizes the <svg>. */
export function Town({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable={false}
      className={cn(css.town, className)}
      style={
        {
          '--last-step': LAST_STEP,
          '--sun-per-step': `${94 / LAST_STEP}deg`,
          '--dusk-from': stepOf('today')
        } as CSSProperties
      }
    >
      <Sky />
      <g className={css.camera}>
        <SunOnArc />
        <Clouds />
        <Birds />
        <Balloon />
        <FarHills />
        <MidHills />
        <Trail />
        <Lhota />
        <StAnne />
        <Brethren />
        <BrethrenLetters />
        <FirstSchool />
        <Church />
        <Fara />
        <TownHall />
        <SugarFactory />
        <Ground />
        <Nature />
        <Square />
        <Cantor />
        <SquareSchool />
        <Realka />
        <Skala />
        <DreamSchool />
        <TodaySchool />
        <TrailMarker />
        <Masaryk />
        <Kids />
        <Railway />
        <River />
        <HeroSign />
        <Boy />
        <RychnovSign />
      </g>
    </svg>
  )
}
