import type { ReactNode, SVGProps } from 'react'

/**
 * Hand-inked comic scenes for /historie-2/. All decorative (the parent
 * art frame is aria-hidden; facts live in the captions). Flat fills, thick
 * ink outlines, palette from globals.css.
 */

const INK = '#1d2150'
const PAPER = '#fffdf8'
const CREAM = '#fff9f0'
const SUN = '#ffcf33'
const SUN_TINT = '#fff4c7'
const TANGERINE = '#ff8a00'
const BERRY = '#ff5c8a'
const SKY = '#3a9bff'
const SKY_TINT = '#dcedff'
const GRASS = '#2fbf71'
const GRASS_TINT = '#d8f5e4'
const GRAPE = '#8a5cf6'
const WOOD = '#d9a066'
const WOOD_DARK = '#a0673a'
const SLATE = '#3d3f63'

const LETTER = { fontFamily: 'var(--font-display)', fontWeight: 800 } as const

function Scene({ w, h, children, ...rest }: { w: number; h: number; children: ReactNode } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" aria-hidden focusable={false} {...rest}>
      {children}
    </svg>
  )
}

const ink = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' } as const

/* ----------------------------------------------------------- 1519 book */

export function BookArt() {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a0 = (i / 12) * Math.PI * 2
    const a1 = a0 + Math.PI / 14
    const R = 400
    return `160,118 ${160 + R * Math.cos(a0)},${118 + R * Math.sin(a0)} ${160 + R * Math.cos(a1)},${118 + R * Math.sin(a1)}`
  })
  const letters: [string, number, number, number, string][] = [
    ['A', 86, 58, -16, SKY],
    ['B', 130, 34, -6, BERRY],
    ['Č', 186, 40, 10, GRASS],
    ['Ř', 236, 62, 18, TANGERINE],
    ['ů', 262, 32, 24, GRAPE],
    ['ch', 52, 30, -24, SUN]
  ]
  return (
    <Scene w={320} h={200}>
      <rect width="320" height="200" fill={SUN_TINT} />
      {rays.map((p, i) => (
        <polygon key={i} points={p} fill={SUN} opacity="0.45" />
      ))}
      <path d="M56 160 Q110 147 160 163 Q210 147 264 160 L264 170 Q210 156 160 173 Q110 156 56 170 Z" fill={BERRY} {...ink} />
      <path d="M66 156 Q112 142 160 158 L160 80 Q112 64 66 78 Z" fill={PAPER} {...ink} />
      <path d="M254 156 Q208 142 160 158 L160 80 Q208 64 254 78 Z" fill={PAPER} {...ink} />
      {[96, 108, 120, 132].map((y) => (
        <g key={y} stroke={INK} strokeWidth="2.6" strokeLinecap="round" opacity="0.35" fill="none">
          <path d={`M80 ${y} Q112 ${y - 8} 148 ${y + 3}`} />
          <path d={`M172 ${y + 3} Q208 ${y - 8} 240 ${y}`} />
        </g>
      ))}
      {/* motion streaks from the book to the letters */}
      <g fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" opacity="0.7">
        <path d="M118 84 Q108 74 102 70" />
        <path d="M144 76 Q140 60 138 52" />
        <path d="M176 76 Q182 64 186 56" />
        <path d="M206 82 Q220 76 228 74" />
      </g>
      {letters.map(([t, x, y, r, c]) => (
        <text
          key={t}
          x={x}
          y={y}
          transform={`rotate(${r} ${x} ${y})`}
          textAnchor="middle"
          fontSize="30"
          fill={c}
          stroke={INK}
          strokeWidth="2.5"
          paintOrder="stroke"
          style={LETTER}
        >
          {t}
        </text>
      ))}
    </Scene>
  )
}

/* ------------------------------------------------------ kantor's bell */

export function BellArt() {
  return (
    <Scene w={240} h={180}>
      <rect width="240" height="180" fill={SKY_TINT} />
      <circle cx="120" cy="100" r="70" fill={PAPER} opacity="0.7" />
      <rect x="18" y="22" width="204" height="14" rx="3" fill={WOOD_DARK} {...ink} />
      <g transform="rotate(-18 120 36)">
        <path d="M120 36 V58" stroke={INK} strokeWidth="5" />
        <path d="M86 128 C86 86 98 58 120 58 C142 58 154 86 154 128 L166 142 L74 142 Z" fill={SUN} {...ink} strokeWidth="3.5" />
        <path d="M80 134 H160" stroke={INK} strokeWidth="2.5" opacity="0.5" />
        <path d="M100 120 C100 94 105 76 115 68" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <circle cx="120" cy="153" r="10" fill={TANGERINE} {...ink} />
      </g>
      <g fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round">
        <path d="M42 74 Q30 102 42 130" />
        <path d="M26 64 Q8 102 26 140" />
        <path d="M188 64 Q200 92 190 118" />
        <path d="M204 56 Q222 92 206 128" />
      </g>
      {/* little music notes - kantor comes from "cantare" */}
      <g fill={INK}>
        <circle cx="200" cy="154" r="5" />
        <path d="M204 154 V132 L214 136" stroke={INK} strokeWidth="2.5" fill="none" />
        <circle cx="34" cy="160" r="4.5" />
        <path d="M38 160 V142" stroke={INK} strokeWidth="2.5" />
      </g>
    </Scene>
  )
}

/* ------------------------------------------------ the kantor's wages */

export function PayArt() {
  const logs: [number, number][] = [
    [36, 136],
    [62, 136],
    [88, 136],
    [49, 114],
    [75, 114],
    [62, 92]
  ]
  return (
    <Scene w={240} h={180}>
      <rect width="240" height="180" fill={GRASS_TINT} />
      <circle cx="206" cy="30" r="16" fill={SUN} {...ink} />
      <path d="M0 148 Q120 126 240 148 V180 H0 Z" fill={GRASS} {...ink} />
      {logs.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="13" fill={WOOD} {...ink} />
          <circle cx={x} cy={y} r="6" fill="none" stroke={WOOD_DARK} strokeWidth="2" />
        </g>
      ))}
      <path d="M150 112 Q186 60 222 112" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d="M150 112 Q186 60 222 112" fill="none" stroke="#c98a4a" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="166" cy="106" rx="9" ry="11" fill={CREAM} {...ink} strokeWidth="2.5" />
      <ellipse cx="183" cy="102" rx="9" ry="11" fill={CREAM} {...ink} strokeWidth="2.5" />
      <ellipse cx="207" cy="104" rx="16" ry="10" fill="#e0a458" {...ink} strokeWidth="2.5" />
      <path d="M198 100 L202 106 M206 98 L210 104 M214 99 L217 105" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M146 110 H228 L218 148 H156 Z" fill="#c98a4a" {...ink} />
      <path d="M150 122 H224 M153 134 H221 M170 110 L174 148 M192 110 L192 148 M212 110 L208 148" stroke={INK} strokeWidth="1.8" opacity="0.5" />
      {/* two coins */}
      <g {...ink} strokeWidth="2.5">
        <ellipse cx="122" cy="84" rx="13" ry="13" fill={SUN} />
        <ellipse cx="132" cy="70" rx="11" ry="11" fill={SUN} />
      </g>
      <text x="122" y="89" textAnchor="middle" fontSize="12" fill={INK} style={LETTER}>
        zl.
      </text>
      <g transform="rotate(-6 186 40)">
        <rect x="140" y="30" width="92" height="22" rx="4" fill={PAPER} {...ink} strokeWidth="2.5" />
        <text x="186" y="46" textAnchor="middle" fontSize="12.5" fill={INK} style={LETTER}>
          SOBOTÁLES
        </text>
      </g>
    </Scene>
  )
}

/* ----------------------------------------------------- 1853 decree */

export function DecreeArt() {
  return (
    <Scene w={320} h={220}>
      <rect width="320" height="220" fill="#ffe0ea" />
      <g opacity="0.35" fill={BERRY}>
        {Array.from({ length: 60 }, (_, i) => (
          <circle key={i} cx={(i % 10) * 34 + 10} cy={Math.floor(i / 10) * 38 + 12} r="3" />
        ))}
      </g>
      <path d="M72 38 H248 V186 H72 Z" fill={SUN_TINT} {...ink} />
      <rect x="60" y="26" width="200" height="18" rx="9" fill="#ffe6c7" {...ink} />
      <rect x="60" y="180" width="200" height="18" rx="9" fill="#ffe6c7" {...ink} />
      <text x="160" y="72" textAnchor="middle" fontSize="20" fill={INK} letterSpacing="2" style={LETTER}>
        POVOLENÍ
      </text>
      {[90, 102, 114, 126, 138].map((y, i) => (
        <path key={y} d={`M92 ${y} H${[226, 214, 230, 200, 220][i]}`} stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      ))}
      <text x="94" y="166" fontSize="13" fill={INK} fontStyle="italic" style={{ ...LETTER, fontWeight: 600 }}>
        28. září 1853
      </text>
      <g transform="rotate(-12 168 112)">
        <rect x="112" y="96" width="112" height="32" rx="4" fill="none" stroke={BERRY} strokeWidth="3.5" />
        <text x="168" y="118" textAnchor="middle" fontSize="15" fill={BERRY} style={LETTER}>
          HLAVNÍ ŠKOLA
        </text>
      </g>
      <path d="M212 166 L204 196 L214 190 L220 200 L222 168 Z" fill={BERRY} {...ink} strokeWidth="2.5" />
      <path d="M228 166 L236 196 L226 190 L220 200" fill={BERRY} {...ink} strokeWidth="2.5" />
      <circle cx="220" cy="160" r="17" fill={BERRY} {...ink} />
      <path d="M220 149 L223 157 L231 157 L225 162 L227 170 L220 165 L213 170 L215 162 L209 157 L217 157 Z" fill={SUN} stroke={INK} strokeWidth="1.5" />
    </Scene>
  )
}

/* ------------------------------------------------ 1868 arrival */

export function ArrivalArt() {
  return (
    <Scene w={320} h={200}>
      <rect width="320" height="200" fill={SKY_TINT} />
      <g fill={PAPER} {...ink} strokeWidth="2.5">
        <path d="M40 46 a14 14 0 0 1 26 -6 a12 12 0 0 1 22 8 a10 10 0 0 1 -2 18 H44 a10 10 0 0 1 -4 -20 z" />
        <path d="M220 30 a12 12 0 0 1 22 -4 a10 10 0 0 1 18 8 a8 8 0 0 1 -2 14 H222 a8 8 0 0 1 -2 -18 z" />
      </g>
      <path d="M0 132 Q70 104 150 124 T320 112 V200 H0 Z" fill={GRASS} {...ink} />
      <path d="M0 160 Q110 140 200 156 T320 150 V200 H0 Z" fill="#7fd9a8" {...ink} />
      <path d="M120 200 Q150 160 236 136 L256 138 Q190 168 176 200 Z" fill={SUN_TINT} {...ink} />
      {/* signpost */}
      <path d="M262 64 V150" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M262 64 V150" stroke={WOOD_DARK} strokeWidth="4" strokeLinecap="round" />
      <g transform="rotate(-4 262 80)">
        <path d="M208 66 H298 L312 80 L298 94 H208 Z" fill={TANGERINE} {...ink} />
        <text x="258" y="85.5" textAnchor="middle" fontSize="14" fill={INK} letterSpacing="1" style={LETTER}>
          KOSTELEC
        </text>
      </g>
      {/* suitcase */}
      <g {...ink}>
        <rect x="132" y="150" width="46" height="32" rx="5" fill={BERRY} />
        <path d="M146 150 V142 H164 V150" fill="none" strokeWidth="3.5" />
        <path d="M132 164 H178" strokeWidth="2.5" />
      </g>
    </Scene>
  )
}

/* ------------------------------------------- 1870 homesick: 3 beats */

export function FieldArt(props: SVGProps<SVGSVGElement>) {
  return (
    <Scene w={300} h={180} {...props}>
      <rect width="300" height="180" fill={SKY_TINT} />
      <circle cx="40" cy="34" r="16" fill={SUN} {...ink} />
      <path d="M0 98 Q150 80 300 94 V180 H0 Z" fill={SUN_TINT} {...ink} />
      {/* towers of sv. Anna on the horizon */}
      <g fill={SLATE} {...ink} strokeWidth="2.5">
        <path d="M222 92 V58 L229 40 L236 58 V92 Z" />
        <path d="M242 92 V62 L249 44 L256 62 V92 Z" />
        <rect x="230" y="70" width="18" height="22" />
      </g>
      <g fill={SUN}>
        <rect x="226" y="62" width="5" height="7" />
        <rect x="246" y="66" width="5" height="7" />
      </g>
      {/* furrows */}
      <g stroke={TANGERINE} strokeWidth="2.5" opacity="0.5">
        {[-60, 0, 60, 120, 180, 240, 300, 360].map((x) => (
          <path key={x} d={`M${x} 180 L240 94`} />
        ))}
      </g>
      <path d="M70 180 Q140 132 238 94" fill="none" stroke={INK} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
    </Scene>
  )
}

export function PeekArt(props: SVGProps<SVGSVGElement>) {
  return (
    <Scene w={240} h={180} {...props}>
      <rect width="240" height="180" fill={SUN_TINT} />
      {[0, 40, 80, 120, 160, 200].map((x) => (
        <g key={x}>
          <path d={`M${x + 2} 180 V22 L${x + 20} 6 L${x + 38} 22 V180 Z`} fill={WOOD} {...ink} />
          <path d={`M${x + 12} 40 Q${x + 16} 80 ${x + 12} 120 M${x + 28} 60 Q${x + 24} 110 ${x + 28} 160`} stroke={WOOD_DARK} strokeWidth="2" fill="none" />
        </g>
      ))}
      <rect x="0" y="54" width="240" height="14" fill={WOOD_DARK} {...ink} />
      <rect x="0" y="136" width="240" height="14" fill={WOOD_DARK} {...ink} />
      {/* knot hole with an eye + glasses looking through */}
      <circle cx="120" cy="100" r="31" fill="#2a1c12" {...ink} strokeWidth="4" />
      <circle cx="120" cy="100" r="24" fill="#ffd9b0" />
      <circle cx="122" cy="100" r="16" fill={CREAM} stroke={INK} strokeWidth="4.5" />
      <circle cx="125" cy="101" r="5.5" fill={INK} />
      <circle cx="127" cy="99" r="1.6" fill="#fff" />
      <path d="M98 88 L106 92" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </Scene>
  )
}

export function RunArt(props: SVGProps<SVGSVGElement>) {
  return (
    <Scene w={240} h={180} {...props}>
      <rect width="240" height="180" fill="#ffe6c7" />
      <path d="M0 150 H240 V180 H0 Z" fill={SUN_TINT} {...ink} />
      <g stroke={INK} strokeWidth="3.5" strokeLinecap="round">
        <path d="M150 50 H226" />
        <path d="M160 72 H236" />
        <path d="M146 94 H210" />
        <path d="M158 116 H232" />
      </g>
      <g fill={PAPER} {...ink} strokeWidth="2.5">
        <circle cx="168" cy="146" r="11" />
        <circle cx="186" cy="140" r="14" />
        <circle cx="206" cy="148" r="10" />
        <circle cx="222" cy="140" r="7" />
      </g>
      <g fill={SKY} stroke={INK} strokeWidth="2">
        <path d="M118 24 Q112 34 118 38 Q124 34 118 24 Z" />
        <path d="M134 34 Q129 42 134 45 Q139 42 134 34 Z" />
      </g>
    </Scene>
  )
}

/* ------------------------------------------------- 1894 Paris splash */

export function OlympicArt() {
  const rings: [number, number, string][] = [
    [176, 30, SKY],
    [210, 30, INK],
    [244, 30, '#e8394f'],
    [193, 46, SUN],
    [227, 46, GRASS]
  ]
  return (
    <Scene w={420} h={190}>
      <path d="M0 162 Q210 148 420 162 V190 H0 Z" fill={GRASS_TINT} {...ink} />
      {/* Eiffel tower */}
      <g fill={SLATE} {...ink} strokeWidth="2.5">
        <path d="M210 64 L214 82 L222 118 L234 150 L248 178 H230 Q210 152 190 178 H172 L186 150 L198 118 L206 82 Z" />
        <rect x="194" y="114" width="32" height="7" />
        <rect x="182" y="146" width="56" height="7" />
        <path d="M210 52 V64" />
      </g>
      <g fill="none" stroke={SUN} strokeWidth="1.6" opacity="0.8">
        <path d="M204 90 L216 106 M216 90 L204 106 M196 126 L224 140 M224 126 L196 140" />
      </g>
      {rings.map(([cx, cy, c]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="15" fill="none" stroke={c} strokeWidth="5.5" />
      ))}
      <g transform="rotate(-4 210 176)">
        <rect x="176" y="164" width="68" height="20" rx="3" fill={PAPER} {...ink} strokeWidth="2.5" />
        <text x="210" y="179" textAnchor="middle" fontSize="13" fill={INK} letterSpacing="1" style={LETTER}>
          PAŘÍŽ
        </text>
      </g>
    </Scene>
  )
}

/* ------------------------------------------ 1919 Prague Castle splash */

export function CastleArt() {
  return (
    <Scene w={420} h={190}>
      <defs>
        <linearGradient id="v2-castle-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ece4ff" />
          <stop offset="1" stopColor="#ffe6c7" />
        </linearGradient>
      </defs>
      <rect width="420" height="190" fill="url(#v2-castle-sky)" />
      <g fill={SUN} {...ink} strokeWidth="2">
        <path d="M40 30 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 z" />
        <path d="M380 44 l2.4 5.6 5.6 .8 -4 4 .8 5.6 -4.8 -2.4 -4.8 2.4 .8 -5.6 -4 -4 5.6 -.8 z" />
      </g>
      {/* St. Vitus */}
      <g fill={SLATE} {...ink} strokeWidth="2.5">
        <path d="M282 102 V58 L293 18 L304 58 V102 Z" />
        <path d="M236 102 V56 L244 34 L252 56 V102 Z" />
        <path d="M256 102 V56 L264 34 L272 56 V102 Z" />
        <path d="M236 102 L250 76 H304 V102 Z" />
      </g>
      <circle cx="264" cy="70" r="5" fill={SUN} stroke={INK} strokeWidth="2" />
      <circle cx="293" cy="62" r="4" fill={SUN} stroke={INK} strokeWidth="2" />
      {/* the long castle front */}
      <path d="M40 104 L54 88 H366 L380 104 Z" fill={SLATE} {...ink} />
      <rect x="44" y="104" width="332" height="56" fill={PAPER} {...ink} />
      <g fill={SKY}>
        {Array.from({ length: 22 }, (_, i) => (
          <g key={i}>
            <rect x={56 + i * 14.6} y="112" width="6" height="11" />
            <rect x={56 + i * 14.6} y="132" width="6" height="11" />
          </g>
        ))}
      </g>
      <path d="M186 160 V136 Q210 120 234 136 V160 Z" fill={SLATE} {...ink} />
      {/* pennant */}
      <path d="M96 88 V58" stroke={INK} strokeWidth="3" />
      <path d="M96 58 Q114 54 128 62 Q112 66 96 70 Z" fill={BERRY} {...ink} strokeWidth="2.5" />
      <path d="M0 160 H420 V190 H0 Z" fill="#d9ccb8" {...ink} />
      <path d="M186 160 L234 160 L276 190 L144 190 Z" fill="#e8394f" {...ink} />
    </Scene>
  )
}

/* ------------------------------------------------ the red trail map */

export function TrailArt() {
  const stops: [string, number, number, boolean][] = [
    ['Kostelec', 34, 156, false],
    ['Potštejn', 92, 96, true],
    ['Litice', 150, 136, true],
    ['Česká Rybná', 206, 74, false],
    ['Žampach', 252, 128, true],
    ['Letohrad', 292, 62, false]
  ]
  const route = 'M34 156 C60 140 70 104 92 96 S136 140 150 136 S190 80 206 74 S238 132 252 128 S280 70 292 62'
  return (
    <Scene w={320} h={200}>
      <rect width="320" height="200" fill={GRASS_TINT} />
      <g fill="none" stroke={GRASS} strokeWidth="2" opacity="0.35">
        <path d="M-10 40 Q60 10 140 36 T320 30" />
        <path d="M-10 60 Q70 30 150 56 T330 52" />
        <path d="M-10 184 Q80 160 160 180 T330 176" />
        <path d="M60 120 q20 -26 50 -8 q24 14 4 30 q-30 18 -54 -22" />
        <path d="M196 110 q22 -18 40 0 q14 18 -10 24 q-26 4 -30 -24" />
      </g>
      <path d={route} fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" />
      <path d={route} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
      <path d={route} fill="none" stroke="#e8394f" strokeWidth="3.5" strokeLinecap="round" />
      {stops.map(([name, x, y, castle]) => (
        <g key={name}>
          {castle && (
            <g transform={`translate(${x - 9} ${y - 36})`} fill={SLATE} stroke={INK} strokeWidth="2" strokeLinejoin="round">
              <path d="M0 22 V6 H4 V10 H7 V6 H11 V10 H14 V6 H18 V22 Z" />
            </g>
          )}
          <circle cx={x} cy={y} r="6.5" fill={SUN} {...ink} strokeWidth="2.5" />
          <text
            x={x}
            y={y + 22}
            textAnchor="middle"
            fontSize="11.5"
            fill={INK}
            stroke={GRASS_TINT}
            strokeWidth="4"
            paintOrder="stroke"
            style={LETTER}
          >
            {name}
          </text>
        </g>
      ))}
      {/* trail marker + distance */}
      <g transform="rotate(6 150 30)">
        <rect x="130" y="16" width="40" height="30" fill="#fff" {...ink} strokeWidth="2.5" />
        <rect x="131.5" y="26" width="37" height="10" fill="#e8394f" />
      </g>
      <g transform="rotate(-10 290 168)">
        <circle cx="290" cy="168" r="24" fill={SUN} {...ink} />
        <text x="290" y="167" textAnchor="middle" fontSize="15" fill={INK} style={LETTER}>
          40
        </text>
        <text x="290" y="180" textAnchor="middle" fontSize="10" fill={INK} style={LETTER}>
          km
        </text>
      </g>
    </Scene>
  )
}

/* -------------------------------------- 1929: the school in a dream */

export function DreamArt() {
  const puffs: [number, number, number][] = [
    [150, 80, 46],
    [206, 56, 52],
    [268, 70, 48],
    [306, 108, 40],
    [264, 138, 44],
    [200, 140, 48],
    [140, 126, 40],
    [118, 98, 30]
  ]
  return (
    <Scene w={420} h={190}>
      <g>
        {puffs.map(([x, y, r]) => (
          <circle key={`o${x}`} cx={x} cy={y} r={r} fill={INK} stroke={INK} strokeWidth="6" />
        ))}
        {puffs.map(([x, y, r]) => (
          <circle key={`f${x}`} cx={x} cy={y} r={r} fill="#fff" />
        ))}
      </g>
      <circle cx="92" cy="158" r="11" fill="#fff" {...ink} />
      <circle cx="68" cy="176" r="6" fill="#fff" {...ink} />
      {/* blueprint */}
      <g transform="rotate(-3 212 100)">
        <rect x="140" y="52" width="148" height="92" fill="#2f6fd6" {...ink} />
        <g stroke="#fff" strokeWidth="0.8" opacity="0.3">
          {Array.from({ length: 14 }, (_, i) => (
            <path key={`v${i}`} d={`M${150 + i * 10} 52 V144`} />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <path key={`h${i}`} d={`M140 ${60 + i * 10} H288`} />
          ))}
        </g>
        <g fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round">
          <rect x="182" y="80" width="92" height="46" />
          <rect x="156" y="68" width="26" height="58" />
          <path d="M150 126 H282" />
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i}>
              <rect x={188 + i * 14} y="88" width="9" height="10" />
              <rect x={188 + i * 14} y="106" width="9" height="10" />
            </g>
          ))}
          <path d="M162 76 H176 M162 86 H176 M162 96 H176 M162 106 H176" />
          <path d="M169 68 V56 L180 60 L169 64" />
        </g>
        <text x="228" y="76" textAnchor="middle" fontSize="9" fill="#fff" letterSpacing="1" style={LETTER}>
          NOVÁ ŠKOLA
        </text>
      </g>
      {/* pencil */}
      <g transform="rotate(38 314 150)">
        <rect x="290" y="144" width="52" height="12" fill={SUN} {...ink} strokeWidth="2.5" />
        <path d="M290 144 L278 150 L290 156 Z" fill={WOOD} {...ink} strokeWidth="2.5" />
        <rect x="338" y="144" width="8" height="12" fill={BERRY} {...ink} strokeWidth="2.5" />
      </g>
    </Scene>
  )
}

/* ----------------------------------------------- today: 4 buildings */

export function TodayArt() {
  const flags = Array.from({ length: 16 }, (_, i) => i)
  const flagColors = [SUN, SKY, BERRY, GRASS, GRAPE, TANGERINE]
  return (
    <Scene w={420} h={200}>
      <rect width="420" height="200" fill={GRASS_TINT} />
      <path d="M0 14 Q210 52 420 14" fill="none" stroke={INK} strokeWidth="2" />
      {flags.map((i) => {
        const x = 10 + i * 26
        const t = x / 420
        const y = 14 + 4 * 38 * t * (1 - t)
        return <path key={i} d={`M${x} ${y} L${x + 18} ${y + 1} L${x + 9} ${y + 18} Z`} fill={flagColors[i % 6]} {...ink} strokeWidth="2" />
      })}
      <path d="M0 170 H420 V200 H0 Z" fill={GRASS} {...ink} />
      {/* Palackého nám. - old two-storey house with a gable */}
      <g {...ink}>
        <rect x="18" y="86" width="90" height="84" fill="#ffe6c7" />
        <path d="M12 88 L63 52 L114 88 Z" fill={TANGERINE} />
        <path d="M50 170 V144 Q63 134 76 144 V170 Z" fill={SLATE} />
      </g>
      {/* Komenského */}
      <g {...ink}>
        <rect x="120" y="70" width="88" height="100" fill={SKY_TINT} />
        <path d="M114 72 H214 L204 58 H124 Z" fill={SKY} />
        <rect x="150" y="38" width="28" height="22" fill={SKY_TINT} />
        <path d="M146 40 L164 24 L182 40 Z" fill={SKY} />
      </g>
      {/* Drtinova - a long modern block */}
      <g {...ink}>
        <rect x="220" y="96" width="112" height="74" fill={PAPER} />
        <rect x="216" y="88" width="120" height="10" fill={GRASS} />
      </g>
      {/* Erbenova - družina */}
      <g {...ink}>
        <rect x="344" y="114" width="64" height="56" fill="#ffe0ea" />
        <path d="M338 116 L376 86 L414 116 Z" fill={BERRY} />
        <circle cx="376" cy="104" r="6" fill={SUN} />
      </g>
      <g fill={SUN} stroke={INK} strokeWidth="2">
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => <rect key={`a${r}${c}`} x={28 + c * 20} y={96 + r * 16} width="10" height="10" />)
        )}
        {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => <rect key={`b${r}${c}`} x={134 + c * 24} y={80 + r * 20} width="12" height="12" />))}
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3, 4, 5].map((c) => <rect key={`c${r}${c}`} x={228 + c * 17} y={106 + r * 20} width="11" height="10" />)
        )}
        <rect x="354" y="128" width="14" height="14" />
        <rect x="386" y="128" width="14" height="14" />
      </g>
      {[
        ['Palackého nám.', 63],
        ['Komenského', 164],
        ['Drtinova', 276],
        ['Erbenova', 376]
      ].map(([label, x]) => (
        <g key={label} transform={`rotate(-3 ${x} 184)`}>
          <rect x={Number(x) - 44} y="174" width="88" height="20" rx="3" fill={PAPER} {...ink} strokeWidth="2.5" />
          <text x={x} y="188.5" textAnchor="middle" fontSize="11.5" fill={INK} style={LETTER}>
            {label}
          </text>
        </g>
      ))}
    </Scene>
  )
}

/* ------------------------------------- 1901: inn sign turned school */

export function InnSignArt() {
  return (
    <svg viewBox="0 0 200 110" aria-hidden focusable={false} style={{ display: 'block', width: '100%', maxWidth: 240, margin: '0 auto' }}>
      <path d="M14 10 H186" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M50 10 V26 M150 10 V26" stroke={INK} strokeWidth="2.5" />
      <g transform="rotate(-3 100 64)">
        <rect x="24" y="26" width="152" height="74" rx="8" fill={WOOD} {...ink} />
        <text x="100" y="56" textAnchor="middle" fontSize="20" fill={WOOD_DARK} style={LETTER}>
          HOSTINEC
        </text>
        <path d="M34 48 L166 58" stroke={BERRY} strokeWidth="5" strokeLinecap="round" />
        <text x="100" y="88" textAnchor="middle" fontSize="24" fill="#fff" stroke={INK} strokeWidth="1.2" style={LETTER}>
          ŠKOLA
        </text>
      </g>
      <path d="M150 80 l6 -14 3 10 8 -6" fill="none" stroke={SUN} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
