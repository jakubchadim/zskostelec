'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, Castle, Church, Mountain, Users, Waves } from 'lucide-react'
import { cn } from '@/lib/utils'

/*
 * A stylised outline of Czechia (lon/lat, simplified by hand) projected into
 * a small SVG, with Prague, Hradec Králové and Kostelec nad Orlicí on it.
 * Equirectangular with cos(50°) for longitude - plenty for a doodle map.
 */
const BORDER: [number, number][] = [
  [12.09, 50.25], [12.32, 50.18], [12.55, 50.4], [12.94, 50.41], [13.25, 50.58], [13.55, 50.71],
  [14.0, 50.82], [14.3, 50.88], [14.52, 51.04], [14.82, 50.87], [15.02, 51.0], [15.25, 51.02],
  [15.4, 50.79], [15.8, 50.74], [16.08, 50.65], [16.35, 50.66], [16.45, 50.57], [16.2, 50.43],
  [16.45, 50.32], [16.6, 50.15], [16.88, 50.2], [17.0, 50.4], [17.3, 50.32], [17.7, 50.31],
  [17.75, 50.17], [17.95, 50.05], [18.25, 49.98], [18.6, 49.92], [18.85, 49.52], [18.55, 49.48],
  [18.38, 49.32], [18.05, 49.05], [17.85, 48.92], [17.55, 48.8], [17.18, 48.6], [16.95, 48.62],
  [16.68, 48.75], [16.38, 48.73], [16.05, 48.76], [15.75, 48.86], [15.35, 48.98], [15.0, 49.0],
  [14.97, 48.78], [14.72, 48.59], [14.35, 48.56], [14.05, 48.62], [13.82, 48.78], [13.5, 48.95],
  [13.18, 49.15], [12.95, 49.34], [12.62, 49.43], [12.48, 49.7], [12.4, 49.95], [12.2, 50.1]
]

const W = 240
const MIN_LON = 11.9
const MAX_LAT = 51.15
const K = W / ((19.0 - MIN_LON) * Math.cos((50 * Math.PI) / 180))

function project([lon, lat]: [number, number]): [number, number] {
  return [(lon - MIN_LON) * Math.cos((50 * Math.PI) / 180) * K, (MAX_LAT - lat) * K]
}

const BORDER_PATH =
  BORDER.map((p, i) => {
    const [x, y] = project(p)
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ') + ' Z'

const PRAHA = project([14.42, 50.08])
const HRADEC = project([15.83, 50.21])
const KOSTELEC = project([16.213, 50.123])
const H = Math.ceil(project([16.95, 48.55])[1]) + 4

const FACTS = [
  { icon: Users, label: '6 252 obyvatel', note: 'k roku 2025' },
  { icon: Mountain, label: '273 m n. m.', note: 'nadmořská výška' },
  { icon: Waves, label: 'Divoká Orlice', note: 'teče pod městem' },
  { icon: Castle, label: 'Nový zámek', note: 'Kinských, 1829–1835' },
  { icon: Church, label: 'Kostel sv. Jiří', note: 'z let 1769–1773' }
]

function MiniMap() {
  const [kx, ky] = KOSTELEC
  const [hx, hy] = HRADEC
  const [px, py] = PRAHA

  return (
    <svg viewBox={`-6 -6 ${W + 12} ${H + 12}`} className="block w-full" aria-hidden focusable={false}>
      <defs>
        <pattern id="town-map-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="#1d2150" opacity=".12" />
        </pattern>
      </defs>
      {/* Country: soft offset shadow + dotted fill + ink outline */}
      <path d={BORDER_PATH} transform="translate(3 3)" fill="#1d2150" />
      <path d={BORDER_PATH} fill="#fff4c7" stroke="#1d2150" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={BORDER_PATH} fill="url(#town-map-dots)" />

      {/* Divoká Orlice - a little wave flowing past Kostelec */}
      <path
        d={`M${kx - 12} ${ky + 8} q6 -5 12 0 t12 0 t12 0 t12 0`}
        fill="none"
        stroke="#3a9bff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Hradec Králové -> Kostelec, drawn in when the card opens */}
      <path
        d={`M${hx} ${hy} Q${(hx + kx) / 2 + 2} ${hy - 16} ${kx} ${ky}`}
        fill="none"
        stroke="#ff5c8a"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="4 5"
        className="town-route"
      />

      <circle cx={px} cy={py} r="4.5" fill="#1d2150" />
      <text x={px} y={py + 16} textAnchor="middle" className="fill-ink font-display text-[11px] font-bold">
        Praha
      </text>
      <circle cx={hx} cy={hy} r="3.6" fill="#fff" stroke="#1d2150" strokeWidth="2" />
      <text x={hx - 4} y={hy - 8} textAnchor="end" className="fill-gray-7 font-display text-[10px] font-bold">
        Hradec Králové
      </text>

      {/* Bouncing pin */}
      <g className="town-pin" style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
        <path
          d={`M${kx} ${ky} c-8 -10 -11 -15 -11 -20 a11 11 0 0 1 22 0 c0 5 -3 10 -11 20 z`}
          fill="#ff8a00"
          stroke="#1d2150"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <circle cx={kx} cy={ky - 20} r="4" fill="#fff9f0" stroke="#1d2150" strokeWidth="1.8" />
      </g>
    </svg>
  )
}

/**
 * "Kostelce nad Orlicí" in the hero copy: dotted underline, and on hover /
 * focus / tap a little card about the town - a doodle map of Czechia with
 * the town pinned, the route from Hradec Králové and a few facts.
 */
export function TownPopover({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const root = useRef<HTMLSpanElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const hideSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 160)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (root.current && e.target instanceof Node && !root.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  return (
    <span ref={root} className="relative inline-block" onMouseEnter={show} onMouseLeave={hideSoon}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        onFocus={show}
        onBlur={hideSoon}
        className="cursor-help font-bold text-ink underline decoration-primary-1 decoration-dotted decoration-[3px] underline-offset-[5px] transition-colors hover:text-primary-3"
      >
        {children}
      </button>

      <span
        id={id}
        role="dialog"
        aria-label="O městě Kostelec nad Orlicí"
        onFocus={show}
        onBlur={hideSoon}
        className={cn(
          // Phones: a card pinned to the bottom of the screen instead of floating next to the word.
          'town-card absolute top-full left-1/2 z-40 mt-4 w-[22rem] -translate-x-1/2 text-left text-base transition-[opacity,transform] duration-200 max-sm:fixed max-sm:inset-x-4 max-sm:top-auto max-sm:bottom-4 max-sm:mt-0 max-sm:w-auto max-sm:translate-x-0',
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
          open && 'is-open'
        )}
      >
        <span className="sticker block overflow-hidden">
          <span className="block bg-sky-tint px-4 pt-4 pb-2">
            <span className="flex items-baseline justify-between gap-2">
              <span className="font-display text-xl leading-tight font-extrabold text-ink">Kostelec nad Orlicí</span>
              <span className="shrink-0 rounded-full border-2 border-ink bg-paper px-2 text-[0.7rem] font-extrabold">
                od roku 1316
              </span>
            </span>
            <span className="mt-0.5 block text-xs font-bold text-gray-7">
              Královéhradecký kraj · 29 km jihovýchodně od Hradce Králové
            </span>
            <span className="mt-2 block">
              <MiniMap />
            </span>
          </span>
          <span className="grid grid-cols-2 gap-x-3 gap-y-2.5 border-t-[2.5px] border-ink px-4 py-3">
            {FACTS.map(({ icon: Icon, label, note }) => (
              <span key={label} className="flex items-start gap-2">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg border-2 border-ink bg-sun-tint">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block text-sm font-extrabold text-ink">{label}</span>
                  <span className="block text-[0.72rem] font-semibold text-gray-6">{note}</span>
                </span>
              </span>
            ))}
          </span>
          <Link
            href="/pracoviste/"
            className="flex items-center justify-between border-t-2 border-dashed border-gray-3 bg-paper px-4 py-2.5 font-display text-sm font-bold text-ink hover:bg-cream"
          >
            Kde nás ve městě najdete
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </span>
      </span>
    </span>
  )
}
