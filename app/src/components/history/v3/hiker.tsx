import { cn } from '@/lib/utils'
import s from './trail.module.css'

/**
 * The school mascot (cartoon Guth-Jarkovský from the school mark - hat,
 * round glasses, upturned moustache, yellow bow tie) dressed for the
 * trail: backpack with a rolled blanket and a walking stick. Faces right.
 * Legs swing while the parent has `data-walking`.
 */
export function Hiker({ className, wave }: { className?: string; wave?: boolean }) {
  return (
    <svg viewBox="0 0 84 112" aria-hidden focusable={false} overflow="visible" className={cn('block', s.hiker, className)}>
      {/* shadow */}
      <ellipse cx="44" cy="108" rx="22" ry="3.5" fill="#1d2150" opacity="0.18" />
      {/* back leg */}
      <g className={s.legB}>
        <rect x="37" y="76" width="9" height="27" rx="4" fill="#2c3168" stroke="#1d2150" strokeWidth="2.2" />
        <path d="M35 100 h13 q4 0 4 4 v2.5 h-17 z" fill="#6b3e1f" stroke="#1d2150" strokeWidth="2.2" strokeLinejoin="round" />
      </g>
      {/* backpack + rolled blanket */}
      <rect x="14" y="49" width="20" height="30" rx="7" fill="#2fbf71" stroke="#1d2150" strokeWidth="2.5" />
      <path d="M16 60 h16" stroke="#1d2150" strokeWidth="2" />
      <rect x="19" y="64" width="10" height="8" rx="2.5" fill="#d8f5e4" stroke="#1d2150" strokeWidth="2" />
      <rect x="12" y="42" width="24" height="10" rx="5" fill="#ff5c8a" stroke="#1d2150" strokeWidth="2.5" />
      {/* front leg */}
      <g className={s.legA}>
        <rect x="42" y="76" width="9" height="27" rx="4" fill="#3d4277" stroke="#1d2150" strokeWidth="2.2" />
        <path d="M40 100 h13 q4 0 4 4 v2.5 h-17 z" fill="#6b3e1f" stroke="#1d2150" strokeWidth="2.2" strokeLinejoin="round" />
      </g>
      {/* jacket */}
      <rect x="29" y="47" width="28" height="35" rx="10" fill="#ff8a00" stroke="#1d2150" strokeWidth="2.5" />
      <path d="M43 50 V80" stroke="#1d2150" strokeWidth="1.6" opacity="0.5" />
      <path d="M32 50 L37 80" stroke="#1d2150" strokeWidth="3" strokeLinecap="round" />
      {/* walking stick */}
      <path d="M64 44 L71 108" stroke="#1d2150" strokeWidth="7" strokeLinecap="round" />
      <path d="M64 44 L71 108" stroke="#b9783f" strokeWidth="3.6" strokeLinecap="round" />
      {/* front arm holding the stick */}
      <g className={wave ? s.waveArm : undefined}>
        <path d="M51 55 Q58 62 65 63" fill="none" stroke="#1d2150" strokeWidth="9" strokeLinecap="round" />
        <path d="M51 55 Q58 62 65 63" fill="none" stroke="#ff8a00" strokeWidth="5" strokeLinecap="round" />
        <circle cx="66" cy="63" r="4.6" fill="#ffd9b0" stroke="#1d2150" strokeWidth="2.2" />
      </g>
      {/* bow tie */}
      <path d="M43 49 L36.5 45.5 V52.5 Z M43 49 L49.5 45.5 V52.5 Z" fill="#ffcf33" stroke="#1d2150" strokeWidth="1.8" strokeLinejoin="round" />
      {/* head */}
      <circle cx="43" cy="31" r="15" fill="#ffd9b0" stroke="#1d2150" strokeWidth="2.5" />
      <circle cx="32.5" cy="36" r="3" fill="#ffb3a0" opacity="0.7" />
      <circle cx="53.5" cy="36" r="3" fill="#ffb3a0" opacity="0.7" />
      <circle cx="37.5" cy="31" r="5" fill="#fff9f0" stroke="#1d2150" strokeWidth="2.2" />
      <circle cx="48.5" cy="31" r="5" fill="#fff9f0" stroke="#1d2150" strokeWidth="2.2" />
      <circle cx="38.5" cy="31.5" r="1.5" fill="#1d2150" />
      <circle cx="49.5" cy="31.5" r="1.5" fill="#1d2150" />
      <path d="M42 30.5 Q43 29.5 44 30.5" fill="none" stroke="#1d2150" strokeWidth="1.6" />
      <path
        d="M43 39.5 C40.5 37.5 35.5 37.3 32.5 39.5 C31 40.6 29.6 39.8 29 37 C28.3 41.4 30.8 43.4 34.6 42.8 C37.8 42.3 40.6 41.7 43 41.7 C45.4 41.7 48.2 42.3 51.4 42.8 C55.2 43.4 57.7 41.4 57 37 C56.4 39.8 55 40.6 53.5 39.5 C50.5 37.3 45.5 37.5 43 39.5 Z"
        fill="#f4f1ea"
        stroke="#1d2150"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* hat */}
      <path d="M31.5 21 L33.5 6.5 Q34.3 3.5 38 3.5 H48 Q51.7 3.5 52.5 6.5 L54.5 21 Z" fill="#1d2150" />
      <rect x="32.6" y="13.5" width="20.8" height="4.2" fill="#ffcf33" />
      <path d="M22 21.5 Q43 16.5 64 21.5 Q65.5 24.5 62 25.5 Q43 21.5 24 25.5 Q20.5 24.5 22 21.5 Z" fill="#1d2150" />
    </svg>
  )
}
