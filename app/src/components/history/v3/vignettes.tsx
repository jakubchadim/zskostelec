import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { KCT_RED, WOOD, WOOD_DARK } from './marks'

/*
 * Little cartoon scenes for stops that have no archival photo. Flat
 * shapes, thick ink outlines, accent palette. Purely decorative: every
 * fact they hint at is in the stop's text.
 */

const INK = '#1d2150'
const line = { stroke: INK, strokeWidth: 2.8, strokeLinejoin: 'round', strokeLinecap: 'round' } as const

const SCENES: Record<string, { tint: string; art: ReactNode }> = {
  bratrska: {
    tint: 'bg-sun-tint',
    art: (
      <>
        <path d="M50 64 V158 Q95 150 130 166 Q165 150 210 158 V64" fill="#ff5c8a" {...line} />
        <path d="M130 72 Q98 56 58 62 V150 Q98 144 130 158 Z" fill="#fffdf8" {...line} />
        <path d="M130 72 Q162 56 202 62 V150 Q162 144 130 158 Z" fill="#fffdf8" {...line} />
        <text x="94" y="100" textAnchor="middle" fontSize="22" fontWeight="800" fill={INK} fontFamily="var(--font-display)">
          A B C
        </text>
        <path d="M72 116 Q94 112 116 118 M72 130 Q94 126 116 132" fill="none" stroke={INK} strokeWidth="2" opacity="0.4" />
        <path d="M144 86 Q166 80 188 84 M144 100 Q166 94 188 98 M144 114 Q166 108 188 112 M144 128 Q160 124 176 126" fill="none" stroke={INK} strokeWidth="2" opacity="0.4" />
        {/* quill */}
        <path d="M222 22 C196 30 170 60 160 104 C178 82 206 58 222 22 Z" fill="#fff" {...line} />
        <path d="M218 28 L158 112" stroke={INK} strokeWidth="2" />
        <path d="M158 112 L153 124" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M30 36 l4 9 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" fill="#ffcf33" {...line} strokeWidth="2.2" />
      </>
    )
  },
  kantori: {
    tint: 'bg-grape-tint',
    art: (
      <>
        <rect x="58" y="22" width="144" height="14" rx="4" fill={WOOD} {...line} />
        <path d="M130 36 V48" {...line} />
        <path d="M100 112 Q100 54 130 50 Q160 54 160 112 Z" fill="#ffcf33" {...line} />
        <rect x="94" y="110" width="72" height="11" rx="5" fill="#ffcf33" {...line} />
        <circle cx="130" cy="128" r="7" fill={INK} />
        <path d="M76 74 q-10 10 0 22 M64 66 q-16 18 0 38 M184 74 q10 10 0 22 M196 66 q16 18 0 38" fill="none" {...line} strokeWidth="2.4" />
        {/* firewood */}
        {[
          [44, 160],
          [68, 160],
          [92, 160],
          [56, 140],
          [80, 140],
          [68, 120]
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="11" fill={WOOD} {...line} strokeWidth="2.4" />
            <circle cx={cx} cy={cy} r="4.5" fill="none" stroke={WOOD_DARK} strokeWidth="2" />
          </g>
        ))}
        {/* coins */}
        {[168, 158, 148].map((cy, i) => (
          <ellipse key={cy} cx={196 - i * 2} cy={cy} rx="20" ry="7" fill="#ffcf33" {...line} strokeWidth="2.4" />
        ))}
        <text x="192" y="152" textAnchor="middle" fontSize="10" fontWeight="800" fill={INK}>
          zl.
        </text>
      </>
    )
  },
  'hlavni-skola': {
    tint: 'bg-grass-tint',
    art: (
      <>
        <rect x="48" y="30" width="150" height="110" rx="10" fill={WOOD} {...line} />
        <rect x="60" y="42" width="126" height="86" rx="4" fill="#24453b" stroke={INK} strokeWidth="2" />
        <text x="123" y="84" textAnchor="middle" fontSize="30" fontWeight="800" fill="#fffdf8" fontFamily="var(--font-display)" opacity="0.92">
          1853
        </text>
        <text x="123" y="114" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fffdf8" opacity="0.75" fontFamily="var(--font-body)">
          a · b · c · 1 · 2
        </text>
        <path d="M70 140 V166 M176 140 V166" {...line} />
        <rect x="190" y="118" width="46" height="48" rx="10" fill="#ff5c8a" {...line} />
        <path d="M196 132 H230 M206 118 Q213 104 220 118" fill="none" {...line} />
        <circle cx="213" cy="146" r="4" fill="#ffcf33" stroke={INK} strokeWidth="2" />
        <path d="M22 160 L52 126 L58 132 L28 166 Z" fill="#ffcf33" {...line} strokeWidth="2.2" />
        <path d="M22 160 L28 166 L18 170 Z" fill={INK} />
      </>
    )
  },
  stesk: {
    tint: 'bg-sky-tint',
    art: (
      <>
        <circle cx="46" cy="40" r="16" fill="#ffcf33" {...line} />
        <path d="M0 110 Q70 92 130 104 T260 98 V190 H0 Z" fill="#2fbf71" {...line} />
        <path d="M0 140 Q80 120 150 134 T260 128" fill="none" stroke="#16784a" strokeWidth="2.4" opacity="0.5" />
        <path d="M0 166 Q90 148 170 160 T260 154" fill="none" stroke="#16784a" strokeWidth="2.4" opacity="0.5" />
        {/* church on the horizon */}
        <rect x="178" y="78" width="40" height="26" fill="#fff9f0" {...line} strokeWidth="2.4" />
        <path d="M174 80 L198 64 L222 80" fill="#ff5c8a" {...line} strokeWidth="2.4" />
        <rect x="158" y="52" width="18" height="52" fill="#fff9f0" {...line} strokeWidth="2.4" />
        <path d="M156 54 L167 28 L178 54 Z" fill="#3a9bff" {...line} strokeWidth="2.4" />
        <circle cx="167" cy="66" r="3.5" fill={INK} />
        {/* the path home */}
        <path d="M30 188 Q70 150 110 140 T168 106" fill="none" stroke="#fff4c7" strokeWidth="9" strokeLinecap="round" />
        <path d="M30 188 Q70 150 110 140 T168 106" fill="none" stroke={INK} strokeWidth="2.4" strokeDasharray="2 9" strokeLinecap="round" />
        {/* open book in the grass */}
        <path d="M58 150 Q70 142 82 148 Q94 142 106 150 L106 168 Q94 160 82 166 Q70 160 58 168 Z" fill="#fffdf8" {...line} strokeWidth="2.4" />
        <path d="M82 148 V166" stroke={INK} strokeWidth="2" />
        {/* longing heart */}
        <path d="M122 54 c-6 -10 -20 -4 -14 6 l14 14 14 -14 c6 -10 -8 -16 -14 -6 z" fill="#ff5c8a" {...line} strokeWidth="2.4" />
      </>
    )
  },
  stezka: {
    tint: 'bg-tangerine-tint',
    art: (
      <>
        <path d="M14 18 L84 10 L160 20 L246 12 L240 176 L164 168 L90 178 L18 170 Z" fill="#fffdf8" {...line} />
        <path d="M84 10 L90 178 M160 20 L164 168" stroke={INK} strokeWidth="1.6" opacity="0.25" />
        <path d="M30 120 q30 -26 64 -6 t70 -2 M120 160 q30 -20 70 -4 M40 60 q20 -14 44 0" fill="none" stroke="#2fbf71" strokeWidth="2" opacity="0.55" />
        <path d="M36 42 L84 62 L112 96 L150 90 L188 124 L222 146" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
        <path d="M36 42 L84 62 L112 96 L150 90 L188 124 L222 146" fill="none" stroke={KCT_RED} strokeWidth="3.6" strokeDasharray="8 5" strokeLinecap="round" />
        <path d="M222 146 L238 166" fill="none" stroke={KCT_RED} strokeWidth="3" strokeDasharray="2 5" strokeLinecap="round" />
        {(
          [
            [36, 42, 'Kostelec', 'start', 8, -8],
            [84, 62, 'Potštejn', 'start', 8, -6],
            [112, 96, 'Litice', 'end', -8, 4],
            [150, 90, 'Č. Rybná', 'start', 4, -10],
            [188, 124, 'Žampach', 'end', -8, -8],
            [222, 146, 'Letohrad', 'end', -8, 16]
          ] as const
        ).map(([x, y, label, anchor, dx, dy]) => (
          <g key={label}>
            <circle cx={x} cy={y} r="5.5" fill="#ffcf33" stroke={INK} strokeWidth="2.2" />
            <text x={x + dx} y={y + dy} textAnchor={anchor} fontSize="11" fontWeight="800" fill={INK} fontFamily="var(--font-body)">
              {label}
            </text>
          </g>
        ))}
        <g transform="rotate(-8 206 42)">
          <rect x="176" y="28" width="62" height="28" rx="14" fill="#ff8a00" {...line} strokeWidth="2.4" />
          <text x="207" y="48" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily="var(--font-display)">
            40 km
          </text>
        </g>
      </>
    )
  },
  'nova-skola': {
    tint: 'bg-sky-tint',
    art: (
      <>
        <rect x="26" y="20" width="208" height="150" rx="6" fill="#2a6fc9" {...line} />
        <path
          d="M46 20 V170 M66 20 V170 M86 20 V170 M106 20 V170 M126 20 V170 M146 20 V170 M166 20 V170 M186 20 V170 M206 20 V170 M26 40 H234 M26 60 H234 M26 80 H234 M26 100 H234 M26 120 H234 M26 140 H234 M26 160 H234"
          stroke="#fff"
          strokeWidth="1"
          opacity="0.18"
        />
        <g fill="none" stroke="#fff" strokeWidth="2.6" strokeDasharray="7 5" strokeLinejoin="round">
          <path d="M50 150 V92 H210 V150 Z" />
          <path d="M110 92 V64 L130 46 L150 64 V92" />
          <path d="M64 108 h18 v16 h-18z M98 108 h18 v16 h-18z M144 108 h18 v16 h-18z M178 108 h18 v16 h-18z M122 126 h16 v24 h-16z" />
        </g>
        <circle cx="130" cy="72" r="6" fill="none" stroke="#fff" strokeWidth="2.2" />
        <text x="214" y="70" textAnchor="middle" fontSize="54" fontWeight="800" fill="#ffcf33" stroke={INK} strokeWidth="2.5" paintOrder="stroke" fontFamily="var(--font-display)">
          ?
        </text>
        <path d="M36 182 L96 160 L100 168 L40 190 Z" fill="#ffcf33" {...line} strokeWidth="2.2" />
      </>
    )
  }
}

/** Blob sticker with a little scene, or `null` when the stop has none. */
export function Vignette({ id, className }: { id: string; className?: string }) {
  const scene = SCENES[id]
  if (!scene) {
    return null
  }
  return (
    <div
      aria-hidden
      className={cn(
        'mx-auto w-full max-w-[20rem] rounded-[46%_54%_50%_50%/52%_46%_54%_48%] border-[2.5px] border-ink p-6 shadow-pop',
        scene.tint,
        className
      )}
    >
      <svg viewBox="0 0 260 190" className="block h-auto w-full" overflow="visible">
        {scene.art}
      </svg>
    </div>
  )
}
