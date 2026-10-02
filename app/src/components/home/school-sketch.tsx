import { cn } from '@/lib/utils'
import css from './school-sketch.module.css'

const ink = '#1d2150'
const stroke = { stroke: ink, strokeWidth: 4, strokeLinejoin: 'round' as const }

// Palackého náměstí 45, as in the 3D model (workplaces/data.ts): orange walls, darker plinth,
// dark red gable roof; the back wing with the light walls and orange hipped roof peeks out on the right.
const WALL = '#e3a24a'
const PLINTH = '#c4692c'
const ROOF = '#8a3b22'
const WING_WALL = '#f0c8a2'
const WING_ROOF = '#e0784a'

const COLS = [92, 142, 192, 292, 342, 392]
const ROWS = [180, 236]

/**
 * A flat cartoon of the main school building in the site's ink-outline
 * style. With `building`, it assembles itself in a loop (the loader while
 * the 3D model downloads); without, it's simply drawn (no-WebGL fallback).
 */
export function SchoolSketch({ building = false, className }: { building?: boolean; className?: string }) {
  const d = (step: number) => ({ '--d': String(step) }) as React.CSSProperties

  return (
    <svg viewBox="0 0 520 400" className={cn('block w-full', building && css.building, className)} aria-hidden focusable={false}>
      {/* Ground */}
      <g className={css.ground}>
        <ellipse cx="260" cy="352" rx="235" ry="22" fill="#cfe8b0" {...stroke} />
        <path d="M222 352 h76 l18 26 h-112 z" fill="#efe2c8" {...stroke} />
      </g>

      {/* Trees */}
      <g className={css.tree} style={d(300)}>
        <path d="M40 350 v-46" {...stroke} strokeWidth={5} />
        <circle cx="40" cy="290" r="28" fill="#9fd48a" {...stroke} />
      </g>
      <g className={css.tree} style={d(420)}>
        <path d="M492 350 v-36" {...stroke} strokeWidth={5} />
        <circle cx="492" cy="300" r="22" fill="#2fbf71" {...stroke} />
      </g>

      {/* Back wing (behind the main block) */}
      <rect className={css.wall} style={d(80)} x="380" y="150" width="96" height="192" rx="3" fill={WING_WALL} {...stroke} />
      <path className={css.roof} style={d(1150)} d="M372 152 L484 152 L456 112 L400 112 Z" fill={WING_ROOF} {...stroke} />

      {/* Main block */}
      <g className={css.wall} style={d(160)}>
        <rect x="64" y="160" width="360" height="182" rx="3" fill={WALL} {...stroke} />
        <rect x="64" y="282" width="360" height="60" fill={PLINTH} {...stroke} />
        <path d="M64 272 h360" {...stroke} strokeWidth={3} opacity={0.5} />
      </g>

      {/* Windows (upper floors) */}
      {ROWS.map((y, row) =>
        COLS.map((x, col) => (
          <g key={`${x}-${y}`} className={css.window} style={d(600 + (row * COLS.length + col) * 45)}>
            <rect x={x - 14} y={y} width="28" height="36" rx="3" fill="#cfe9ff" {...stroke} strokeWidth={3} />
            <path d={`M${x} ${y} v36 M${x - 14} ${y + 16} h28`} stroke={ink} strokeWidth={2} />
          </g>
        ))
      )}
      {/* Ground floor windows + door */}
      {COLS.map((x, col) => (
        <rect
          key={`g-${x}`}
          className={css.window}
          style={d(600 + (ROWS.length * COLS.length + col) * 45)}
          x={x - 12}
          y="296"
          width="24"
          height="30"
          rx="3"
          fill="#cfe9ff"
          {...stroke}
          strokeWidth={3}
        />
      ))}
      <g className={css.window} style={d(1050)}>
        <rect x="226" y="286" width="48" height="56" rx="20" fill="#8a5a3a" {...stroke} />
        <circle cx="262" cy="316" r="3" fill={ink} />
      </g>
      <rect className={css.canopy} style={d(1100)} x="214" y="270" width="72" height="12" rx="4" fill="#ff5c8a" {...stroke} strokeWidth={3} />
      {/* Window above the door, with the school sign */}
      <g className={css.window} style={d(1080)}>
        <rect x="221" y="187" width="58" height="28" rx="6" fill="#fffdf8" {...stroke} strokeWidth={3} />
        <text x="250" y="206" textAnchor="middle" fontSize="13" fontWeight={800} fill={ink} className="font-display">
          ŠKOLA
        </text>
      </g>

      {/* Roof */}
      <path className={css.roof} style={d(1250)} d="M50 162 L438 162 L398 104 L90 104 Z" fill={ROOF} {...stroke} />
      <path className={css.roof} style={d(1300)} d="M130 104 v-14 h20 v14" fill="#b35300" {...stroke} strokeWidth={3} />

      {/* Flag on the right end of the roof */}
      <g className={css.flag}>
        <path d="M384 104 V44" {...stroke} strokeWidth={4} />
        <path className={css.flagCloth} d="M386 46 h46 l-10 13 l10 13 h-46 z" fill="#ff8a00" {...stroke} strokeWidth={3} />
      </g>
    </svg>
  )
}
