import { cn } from '@/lib/utils'
import { KCT_RED, WOOD } from './marks'
import { Hiker } from './hiker'
import s from './trail.module.css'

/* Big decorative landscapes: the trailhead (hero) and the summit (finish). */

const INK = '#1d2150'
const line = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' } as const

function Tree({ x, y, scale = 1, fill = '#2fbf71' }: { x: number; y: number; scale?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-4" y="-6" width="8" height="18" fill={WOOD} {...line} strokeWidth={2.5} />
      <path d="M0 -62 L22 -24 H12 L28 -2 H-28 L-12 -24 H-22 Z" fill={fill} {...line} strokeWidth={2.5} />
    </g>
  )
}

function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0 20 Q-2 4 14 4 Q18 -10 34 -6 Q46 -16 58 -4 Q74 -4 72 12 Q80 22 66 26 H6 Q-6 26 0 20 Z"
      fill="#fff"
      {...line}
      strokeWidth={2.5}
    />
  )
}

/** Trailhead: hills, the town, a winding red-marked path and a signpost. */
export function TrailheadScene({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('relative', className)}>
      <svg viewBox="0 0 520 400" className="block h-auto w-full" overflow="visible">
        {/* sun */}
        <g className={s.spin}>
          {Array.from({ length: 10 }, (_, i) => (
            <path key={i} d="M440 18 V2" transform={`rotate(${i * 36} 440 62)`} stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          ))}
        </g>
        <circle cx="440" cy="62" r="32" fill="#ffcf33" {...line} />
        <Cloud x={60} y={44} scale={1.1} />
        <Cloud x={300} y={20} scale={0.8} />

        <defs>
          <clipPath id="v3-hero-island">
            <rect x="8" y="96" width="504" height="292" rx="56" />
          </clipPath>
        </defs>
        {/* the landscape is a rounded "sticker" island with a hard shadow */}
        <rect x="15" y="103" width="504" height="292" rx="56" fill={INK} />
        <g clipPath="url(#v3-hero-island)">
          <rect x="0" y="90" width="520" height="310" fill="#eaf6ff" />
          {/* far hills */}
          <path d="M-20 210 Q60 120 150 170 Q230 110 330 160 Q420 100 540 170 V400 H-20 Z" fill="#b9e6c9" {...line} />
          {/* near hills */}
          <path d="M-20 270 Q90 200 210 250 Q320 290 400 230 Q470 190 540 220 V400 H-20 Z" fill="#2fbf71" {...line} />
          <Tree x={420} y={236} scale={0.9} fill="#16784a" />
          <Tree x={455} y={226} scale={1.1} fill="#16784a" />
          <Tree x={492} y={232} scale={0.85} fill="#16784a" />
          <Tree x={36} y={252} scale={0.8} fill="#16784a" />
          {/* meadow */}
          <path d="M-20 330 Q120 290 260 320 T540 300 V420 H-20 Z" fill="#8fdcae" {...line} />
          {/* the trail */}
          <path d="M330 420 Q300 350 360 320 T300 262 Q240 236 214 196" fill="none" stroke={INK} strokeWidth="22" strokeLinecap="round" />
          <path d="M330 420 Q300 350 360 320 T300 262 Q240 236 214 196" fill="none" stroke="#f3dcae" strokeWidth="16" strokeLinecap="round" />
          <path d="M330 420 Q300 350 360 320 T300 262 Q240 236 214 196" fill="none" stroke={KCT_RED} strokeWidth="4" strokeDasharray="14 11" strokeLinecap="round" />
          {/* flowers */}
          {[
            [60, 352, '#ff5c8a'],
            [96, 372, '#ffcf33'],
            [470, 352, '#8a5cf6'],
            [430, 380, '#ff5c8a'],
            [200, 372, '#3a9bff']
          ].map(([x, y, c]) => (
            <g key={`${x}`}>
              <path d={`M${x} ${y} v14`} stroke="#16784a" strokeWidth="3" strokeLinecap="round" />
              <circle cx={x as number} cy={y as number} r="7" fill={c as string} stroke={INK} strokeWidth="2.4" />
              <circle cx={x as number} cy={y as number} r="2.5" fill="#fff9f0" />
            </g>
          ))}
        </g>
        <rect x="8" y="96" width="504" height="292" rx="56" fill="none" stroke={INK} strokeWidth="3" />
        {/* town on the hill */}
        <g>
          <rect x="196" y="134" width="44" height="34" fill="#fff9f0" {...line} strokeWidth={2.5} />
          <path d="M190 138 L218 116 L246 138" fill="#ff5c8a" {...line} strokeWidth={2.5} />
          <rect x="172" y="96" width="24" height="72" fill="#fff9f0" {...line} strokeWidth={2.5} />
          <path d="M168 98 L184 62 L200 98 Z" fill="#3a9bff" {...line} strokeWidth={2.5} />
          <circle cx="184" cy="114" r="5" fill="#fff4c7" stroke={INK} strokeWidth="2" />
          <rect x="248" y="146" width="30" height="24" fill="#ffe6c7" {...line} strokeWidth={2.5} />
          <path d="M244 148 L263 132 L282 148" fill="#ff8a00" {...line} strokeWidth={2.5} />
          <rect x="140" y="150" width="28" height="22" fill="#ece4ff" {...line} strokeWidth={2.5} />
          <path d="M136 152 L154 138 L172 152" fill="#8a5cf6" {...line} strokeWidth={2.5} />
        </g>
        {/* signpost */}
        <g>
          <rect x="132" y="196" width="14" height="190" rx="3" fill={WOOD} {...line} />
          <path d="M126 196 h26 l-4 -10 h-18 z" fill="#8a5427" {...line} strokeWidth={2.5} />
          <g transform="rotate(-3 139 230)">
            <path d="M70 212 H220 L240 232 L220 252 H70 Z" fill="#fff" {...line} />
            <rect x="78" y="223" width="26" height="18" rx="2" fill="#fff" stroke={INK} strokeWidth="2" />
            <rect x="79" y="229" width="24" height="6" fill={KCT_RED} />
            <text x="168" y="239.5" textAnchor="middle" fontSize="18" fontWeight="800" fill={INK} fontFamily="var(--font-display)">
              Stezka časem
            </text>
          </g>
          <g transform="rotate(2 139 280)">
            <path d="M206 262 H58 L40 282 L58 302 H206 Z" fill="#fff" {...line} />
            <text x="128" y="289" textAnchor="middle" fontSize="16" fontWeight="800" fill={INK} fontFamily="var(--font-display)">
              14. stol. → dnes
            </text>
          </g>
          <rect x="88" y="316" width="102" height="26" rx="4" fill="#ffcf33" {...line} strokeWidth={2.5} />
          <text x="139" y="334" textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily="var(--font-body)">
            17 zastávek
          </text>
        </g>
      </svg>
      <div className="absolute bottom-[3%] left-[57%] w-[19%]">
        <Hiker wave />
      </div>
    </div>
  )
}

/** Summit with a flag: the end of the trail. */
export function SummitScene({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('relative', className)}>
      <svg viewBox="0 0 420 220" className="block h-auto w-full" overflow="visible">
        <Cloud x={20} y={30} scale={0.9} />
        <Cloud x={320} y={50} scale={0.7} />
        <path d="M-10 220 L120 100 L170 140 L230 60 L300 130 L340 104 L430 220 Z" fill="#b9e6c9" {...line} />
        <path d="M206 92 L230 60 L254 96 L240 90 L230 100 L218 88 Z" fill="#fff" {...line} strokeWidth={2.5} />
        <path d="M-10 222 Q120 160 230 180 T430 190 V222 Z" fill="#2fbf71" {...line} />
        {/* flag on the peak */}
        <path d="M230 60 V8" {...line} strokeWidth={3.5} />
        <g className={s.flag}>
          <path d="M230 10 H290 L278 24 L290 38 H230 Z" fill="#ff8a00" {...line} strokeWidth={2.5} />
          <rect x="242" y="16" width="26" height="15" rx="2" fill="#fff" stroke={INK} strokeWidth="2" />
          <rect x="243" y="21" width="24" height="5" fill={KCT_RED} />
        </g>
        <Tree x={70} y={196} scale={0.8} fill="#16784a" />
        <Tree x={372} y={196} scale={0.9} fill="#16784a" />
        {/* finish ribbon */}
        <path d="M120 200 Q210 186 300 200" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d="M120 200 Q210 186 300 200" fill="none" stroke="#ffcf33" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 8" />
        <rect x="114" y="160" width="10" height="56" rx="3" fill={WOOD} {...line} strokeWidth={2.5} />
        <rect x="296" y="160" width="10" height="56" rx="3" fill={WOOD} {...line} strokeWidth={2.5} />
      </svg>
      <div className="absolute bottom-[1%] left-[44%] w-[13%]">
        <Hiker wave />
      </div>
    </div>
  )
}
