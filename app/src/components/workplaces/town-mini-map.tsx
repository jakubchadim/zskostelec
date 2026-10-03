import { useId } from 'react'
import { ACCENT_HEX, WORKPLACES, type WorkplaceKey } from './data'
import { INDUSTRY, LANDMARKS, MAP_H, MAP_W, PARKS, RAILWAY, RIVER, ROADS, SQUARE, SQUARE_DECOR, type Vec2 } from './town'

/*
 * A flat doodle map of Kostelec nad Orlicí, drawn from the same hand-traced
 * data as the 3D town on /pracoviste/ (map px, 2000x1016). Used in the
 * workplace popovers: the four school buildings as dots, the selected one
 * as a big pin with the walking route from the square.
 */

/** 1 map px ≈ 0.96 m (town.ts: 50 px ≈ 48 m). */
const METERS_PER_PX = 0.96
/** Streets aren't straight lines - pad the crow-flies distance. */
const DETOUR = 1.3
const WALK_M_PER_MIN = 75

const ink = '#1d2150'
const pts = (points: Vec2[]) => points.map(([x, y]) => `${x},${y}`).join(' ')
const SQUARE_CENTER = SQUARE_DECOR.fountain
const SHORT_LABEL: Record<string, string> = { church: 'kostel', castle: 'zámek', station: 'nádraží' }

export function workplacePx(key: WorkplaceKey): Vec2 {
  const w = WORKPLACES.find((item) => item.key === key)!
  return [(w.mapX / 100) * MAP_W, (w.mapY / 100) * MAP_H]
}

/** Rough walking time from Palackého náměstí, in minutes (null = it's on the square). */
export function walkFromSquare(key: WorkplaceKey): number | null {
  const [x, y] = workplacePx(key)
  const meters = Math.hypot(x - SQUARE_CENTER[0], y - SQUARE_CENTER[1]) * METERS_PER_PX * DETOUR
  return meters < 150 ? null : Math.max(1, Math.round(meters / WALK_M_PER_MIN))
}

function LandmarkIcon({ kind, at: [x, y] }: { kind: string; at: Vec2 }) {
  const box = { fill: '#fffdf8', stroke: ink, strokeWidth: 7 }
  switch (kind) {
    case 'church':
      return (
        <g>
          <rect x={x - 26} y={y - 20} width={52} height={44} rx={6} {...box} />
          <path d={`M${x - 16} ${y - 20} L${x} ${y - 52} L${x + 16} ${y - 20}`} {...box} strokeLinejoin="round" />
          <path d={`M${x} ${y - 52} v-22 M${x - 9} ${y - 64} h18`} stroke={ink} strokeWidth={7} strokeLinecap="round" />
        </g>
      )
    case 'castle':
      return (
        <path
          d={`M${x - 34} ${y + 22} v-40 h12 v12 h12 v-12 h20 v12 h12 v-12 h12 v40 z`}
          {...box}
          strokeLinejoin="round"
        />
      )
    case 'station':
      return (
        <g>
          <rect x={x - 32} y={y - 18} width={64} height={36} rx={10} {...box} />
          <circle cx={x - 14} cy={y + 22} r={7} fill={ink} />
          <circle cx={x + 14} cy={y + 22} r={7} fill={ink} />
        </g>
      )
    default:
      return null
  }
}

export function TownMiniMap({ active }: { active: WorkplaceKey }) {
  // Unique per map: the same building can be on a page several times (Palackého náměstí:
  // sídlo, podatelna, footer) and a shared clipPath id would make every copy clip to the first one.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [ax, ay] = workplacePx(active)
  const activeColor = ACCENT_HEX[WORKPLACES.find((w) => w.key === active)!.accent]
  const [sx, sy] = SQUARE_CENTER
  const onSquare = walkFromSquare(active) === null

  return (
    <svg viewBox={`-20 -20 ${MAP_W + 40} ${MAP_H + 40}`} className="block w-full" aria-hidden focusable={false}>
      <defs>
        <clipPath id={`mini-town-clip-${uid}`}>
          <rect x="-20" y="-20" width={MAP_W + 40} height={MAP_H + 40} rx="70" />
        </clipPath>
        <pattern id={`mini-town-dots-${uid}`} width="44" height="44" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="4" fill={ink} opacity=".08" />
        </pattern>
      </defs>
      <g clipPath={`url(#mini-town-clip-${uid})`}>
        <rect x="-20" y="-20" width={MAP_W + 40} height={MAP_H + 40} fill="#fffaf0" />
        <rect x="-20" y="-20" width={MAP_W + 40} height={MAP_H + 40} fill={`url(#mini-town-dots-${uid})`} />

        {PARKS.map((park, i) => (
          <polygon key={i} points={pts(park.points)} fill={park.color} stroke={ink} strokeWidth={6} strokeLinejoin="round" opacity={0.9} />
        ))}
        {INDUSTRY.map((area, i) => (
          <polygon key={i} points={pts(area.points)} fill={area.color} stroke={ink} strokeWidth={5} strokeLinejoin="round" opacity={0.6} />
        ))}

        {/* River: ink outline under the water. */}
        <polyline points={pts(RIVER.points)} fill="none" stroke={ink} strokeWidth={RIVER.width * 50 + 14} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts(RIVER.points)} fill="none" stroke="#7cc4f0" strokeWidth={RIVER.width * 50} strokeLinecap="round" strokeLinejoin="round" />

        {/* Railway: grey line with white sleepers. */}
        <polyline points={pts(RAILWAY.points)} fill="none" stroke="#6b6577" strokeWidth={14} strokeLinejoin="round" />
        <polyline points={pts(RAILWAY.points)} fill="none" stroke="#fffaf0" strokeWidth={6} strokeDasharray="22 22" strokeLinejoin="round" />

        {ROADS.map((road, i) => (
          <polyline
            key={`o${i}`}
            points={pts(road.points)}
            fill="none"
            stroke={ink}
            strokeWidth={road.width * 50 + 10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {ROADS.map((road, i) => (
          <polyline
            key={`r${i}`}
            points={pts(road.points)}
            fill="none"
            stroke={road.color}
            strokeWidth={road.width * 50}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        <polygon points={pts(SQUARE.points)} fill={SQUARE.color} stroke={ink} strokeWidth={7} strokeLinejoin="round" />
        <circle cx={sx} cy={sy} r={12} fill="#7cc4f0" stroke={ink} strokeWidth={5} />

        {LANDMARKS.map((l) => (
          <LandmarkIcon key={l.name} kind={l.kind} at={l.at} />
        ))}
        {LANDMARKS.filter((l) => SHORT_LABEL[l.kind]).map((l) => (
          <text
            key={`t-${l.name}`}
            x={l.at[0]}
            y={l.at[1] + 78}
            textAnchor="middle"
            fontSize={44}
            fontWeight={800}
            className="fill-gray-7 font-display"
            stroke="#fffaf0"
            strokeWidth={14}
            paintOrder="stroke"
          >
            {SHORT_LABEL[l.kind]}
          </text>
        ))}

        <text x={300} y={830} className="fill-[#0f5fb3] font-display" fontSize={52} fontWeight={800} fontStyle="italic">
          Divoká Orlice
        </text>
        <text x={sx} y={SQUARE.points[0][1] - 26} textAnchor="middle" className="fill-ink font-display" fontSize={48} fontWeight={800}>
          náměstí
        </text>

        {/* Walking route from the square, animated by .town-route when the card opens. */}
        {!onSquare && (
          <path
            d={`M${sx} ${sy} Q${(sx + ax) / 2} ${Math.min(sy, ay) - 160} ${ax} ${ay}`}
            fill="none"
            stroke="#ff5c8a"
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray="18 26"
            className="town-route"
          />
        )}

        {/* The other buildings as small coloured dots. */}
        {WORKPLACES.filter((w) => w.key !== active).map((w) => {
          const [x, y] = workplacePx(w.key)
          return <circle key={w.key} cx={x} cy={y} r={24} fill={ACCENT_HEX[w.accent]} stroke={ink} strokeWidth={7} />
        })}

        {/* Selected building: pulsing ring + a big pin that drops in. */}
        <circle cx={ax} cy={ay} r={60} fill={activeColor} opacity={0.35} className="town-pulse" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        <g className="town-pin" style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
          <path
            d={`M${ax} ${ay} c-48 -60 -66 -90 -66 -120 a66 66 0 0 1 132 0 c0 30 -18 60 -66 120 z`}
            fill={activeColor}
            stroke={ink}
            strokeWidth={10}
            strokeLinejoin="round"
          />
          <circle cx={ax} cy={ay - 120} r={24} fill="#fff9f0" stroke={ink} strokeWidth={8} />
        </g>
      </g>
      <rect x="-20" y="-20" width={MAP_W + 40} height={MAP_H + 40} rx="70" fill="none" stroke={ink} strokeWidth={12} />
    </svg>
  )
}
