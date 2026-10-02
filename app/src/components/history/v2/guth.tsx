import { cn } from '@/lib/utils'
import styles from './comic.module.css'

/**
 * Jiří Guth-Jarkovský as a comic character, built from the shapes of the
 * school mark (components/ui/school-logo.tsx) so he reads as "the man from
 * the logo" - and aged up through the story:
 *
 *  - `kid`        1868: sailor collar, messy hair, big glasses
 *  - `young`      1894: doctor of maths & physics, dark hair, small moustache
 *  - `gent`       1919+: the logo itself - hat, white moustache, bow tie, medals
 *  - `coubertin`  baron Pierre de Coubertin (no glasses, grand moustache)
 *
 * Purely decorative (aria-hidden); what he says lives in real text bubbles.
 */

export type GuthVariant = 'kid' | 'young' | 'gent' | 'coubertin'
export type GuthMood = 'smile' | 'talk' | 'wow' | 'sad' | 'wink'

type GuthProps = {
  variant?: GuthVariant
  mood?: GuthMood
  /** Raised waving hand. */
  wave?: boolean
  /** Hat tipped in greeting (gent only). */
  tip?: boolean
  /** Holding a book (the homesick schoolboy). */
  book?: boolean
  /** Mirror horizontally (to face the other way). */
  flip?: boolean
  /** Idle bob animation. */
  bob?: boolean
  /** Square crop around the head (for round "talking head" frames). */
  crop?: boolean
  className?: string
}

const INK = '#1d2150'
const SKIN = '#ffd9b0'
const SKIN_SHADE = '#f2b98c'
const CREAM = '#fff9f0'
const MOUTH = '#8c2f45'

const MOUSTACHE =
  'M50 74.5 C46 71 38 70.5 33 74 C30.5 75.8 28.2 74.6 27 69.5 C25.8 77 30 80.5 36.5 79.5 C42 78.7 46 77.6 50 77.6 C54 77.6 58 78.7 63.5 79.5 C70 80.5 74.2 77 73 69.5 C71.8 74.6 69.5 75.8 67 74 C62 70.5 54 71 50 74.5 Z'

const JACKET: Record<GuthVariant, string> = {
  kid: '#3a9bff',
  young: '#0a6e63',
  gent: INK,
  coubertin: '#3d3f63'
}

const HAIR: Partial<Record<GuthVariant, string>> = {
  kid: '#7a4b25',
  young: '#3a2a1e',
  coubertin: '#2b2620'
}

export function Guth({ variant = 'gent', mood = 'smile', wave, tip, book, flip, bob, crop, className }: GuthProps) {
  const adult = variant !== 'kid'
  const jacket = JACKET[variant]
  const hair = HAIR[variant]

  return (
    <svg
      viewBox={crop ? '8 18 84 84' : '-14 4 128 128'}
      aria-hidden
      focusable={false}
      overflow="visible"
      className={cn('block', bob && styles.bob, className)}
    >
      <g transform={flip ? 'translate(100 0) scale(-1 1)' : undefined}>
        {/* Body */}
        <path
          d="M10 134 C12 111 28 97 50 97 C72 97 88 111 90 134 Z"
          fill={jacket}
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {variant === 'kid' ? (
          <>
            {/* Sailor collar + neckerchief */}
            <path d="M34 98 L50 121 L66 98 L80 106 L50 128 L20 106 Z" fill={CREAM} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M26 108 L50 124 L74 108" fill="none" stroke="#3a9bff" strokeWidth="2.2" />
            <path d="M44 112 L50 124 L56 112 Z" fill="#ff5c8a" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <path d="M40 97 L50 121 L60 97 Z" fill={CREAM} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            <path d="M40 97 L46 112 M60 97 L54 112" stroke={variant === 'gent' ? '#3d4277' : INK} strokeWidth="2" />
          </>
        )}
        {variant === 'gent' && (
          // Medals, as in his portrait.
          <g stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
            <path d="M68 108 L73 108 L72 116 L69 116 Z" fill="#ff5c8a" />
            <circle cx="70.5" cy="119" r="3.6" fill="#ffcf33" />
            <path d="M75 107 L80 107 L79 114 L76 114 Z" fill="#3a9bff" />
            <circle cx="77.5" cy="117" r="3.2" fill="#ffcf33" />
          </g>
        )}

        {/* Waving arm */}
        {wave && (
          <g className={styles.wave}>
            <path d="M80 120 C88 110 94 98 97 86" fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" />
            <path d="M80 120 C88 110 94 98 97 86" fill="none" stroke={jacket} strokeWidth="7.5" strokeLinecap="round" />
            <circle cx="98" cy="80" r="7" fill={SKIN} stroke={INK} strokeWidth="2.2" />
            <path d="M106 66 Q112 74 108 84 M112 62 Q120 74 114 88" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* Head */}
        <circle cx="27.5" cy="63" r="5.5" fill={SKIN} stroke={INK} strokeWidth="1.6" />
        <circle cx="72.5" cy="63" r="5.5" fill={SKIN} stroke={INK} strokeWidth="1.6" />
        {(variant !== 'gent' || tip) && <path d="M28 52 C28 30 38 22 50 22 C62 22 72 30 72 52 Z" fill={SKIN} />}
        <path d="M28 50 C27 77 37 90 50 90 C63 90 73 77 72 50 Z" fill={SKIN} />
        <path
          d={
            variant !== 'gent' || tip
              ? 'M28 52 C28 30 38 22 50 22 C62 22 72 30 72 52 C73 77 63 90 50 90 C37 90 27 77 28 52 Z'
              : 'M28 50 C27 77 37 90 50 90 C63 90 73 77 72 50'
          }
          fill="none"
          stroke={INK}
          strokeWidth="1.6"
        />

        {/* Hair */}
        {variant === 'kid' && (
          <g fill={hair} stroke={INK} strokeWidth="2" strokeLinejoin="round">
            <path d="M27 54 C23 30 36 17 51 17 C67 17 78 30 73 54 C70 45 64 39 57 37 C58 41 56 44 53 45 C50 39 43 37 37 41 C33 44 30 49 27 54 Z" />
            <path d="M49 18 C46 10 53 6 58 10 C54 10 52 13 53 17" />
          </g>
        )}
        {(variant === 'young' || variant === 'coubertin') && (
          <path
            d="M27 52 C24 30 36 19 50 19 C65 19 76 30 73 52 C71 42 64 34 54 33 C52 36 48 36 46 33 C38 35 30 42 27 52 Z"
            fill={hair}
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}

        {/* Brows */}
        {variant !== 'gent' && <Brows mood={mood} heavy={variant === 'coubertin'} />}

        {/* Cheeks & freckles */}
        {variant === 'kid' && (
          <>
            <circle cx="31" cy="73" r="4" fill="#ff5c8a" opacity="0.3" />
            <circle cx="69" cy="73" r="4" fill="#ff5c8a" opacity="0.3" />
            <g fill="#c98a5a">
              <circle cx="35" cy="72" r="0.9" />
              <circle cx="38" cy="74" r="0.9" />
              <circle cx="62" cy="74" r="0.9" />
              <circle cx="65" cy="72" r="0.9" />
            </g>
          </>
        )}

        {/* Nose */}
        <path d="M50 64 C46.5 70 47 73.5 50 73.5 C53 73.5 53.5 70 50 64 Z" fill={SKIN_SHADE} />

        {/* Eyes / glasses */}
        {variant === 'coubertin' ? (
          <Eyes mood={mood} bare />
        ) : (
          <>
            <path d="M31.5 61.5 L28 60 M68.5 61.5 L72 60" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="40" cy="62" r="8.5" fill={CREAM} stroke={INK} strokeWidth="3.6" />
            <circle cx="60" cy="62" r="8.5" fill={CREAM} stroke={INK} strokeWidth="3.6" />
            <path d="M48 61 Q50 59 52 61" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
            <Eyes mood={mood} />
          </>
        )}

        {/* Mouth, then moustache over it */}
        <Mouth mood={mood} kid={!adult} />
        {variant === 'gent' && <path d={MOUSTACHE} fill="#f4f1ea" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />}
        {variant === 'young' && (
          <path d={MOUSTACHE} transform="translate(12.5 19) scale(0.75)" fill={hair} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
        )}
        {variant === 'coubertin' && (
          <path
            d={MOUSTACHE}
            transform="translate(-12.5 -18.6) scale(1.25)"
            fill={hair}
            stroke={INK}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        )}

        {/* Bow tie */}
        {adult && (
          <>
            <path
              d="M50 92 L41 87.5 L41 96.5 Z M50 92 L59 87.5 L59 96.5 Z"
              fill={variant === 'young' ? '#ff5c8a' : variant === 'coubertin' ? INK : '#ffcf33'}
              stroke={INK}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="92" r="2.4" fill={INK} />
          </>
        )}

        {/* Hat (the logo's), optionally tipped */}
        {variant === 'gent' && (
          <g transform={tip ? 'translate(0 -6) rotate(-11 13 53)' : undefined}>
            <path d="M32 46 L34 21 Q35 17 40 17 H60 Q65 17 66 21 L68 46 Z" fill={INK} />
            <path d="M41 21 Q50 25 59 21" fill="none" stroke="#3d4277" strokeWidth="2" strokeLinecap="round" />
            <rect x="33" y="36" width="34" height="6" fill="#ffcf33" />
            <path d="M13 47 Q50 39 87 47 Q89 52 83 53.5 Q50 47 17 53.5 Q11 52 13 47 Z" fill={INK} />
          </g>
        )}

        {/* Book in hand */}
        {book && (
          <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
            <circle cx="26" cy="118" r="6" fill={SKIN} />
            <path d="M14 104 L36 100 L38 126 L16 130 Z" fill="#ff5c8a" />
            <path d="M18 106 L33 103.5" stroke="#fff9f0" strokeWidth="2" />
            <circle cx="36" cy="116" r="5.5" fill={SKIN} />
          </g>
        )}
      </g>
    </svg>
  )
}

function Brows({ mood, heavy }: { mood: GuthMood; heavy: boolean }) {
  const w = heavy ? 3.6 : 2.6
  const d =
    mood === 'wow'
      ? 'M32 46 Q40 41 47 45 M53 45 Q60 41 68 46'
      : mood === 'sad'
        ? 'M33 50 Q40 49 46 45.5 M54 45.5 Q60 49 67 50'
        : 'M33 49 Q40 45 46 48.5 M54 48.5 Q60 45 67 49'
  return <path d={d} fill="none" stroke={INK} strokeWidth={w} strokeLinecap="round" />
}

function Eyes({ mood, bare }: { mood: GuthMood; bare?: boolean }) {
  const r = mood === 'wow' ? 2.9 : bare ? 2.4 : 2.2
  const y = mood === 'sad' ? 64.5 : 62.8
  return (
    <g fill={INK}>
      {bare && (
        <>
          <ellipse cx="40" cy={y} rx="4.5" ry="3.6" fill="#fff" stroke={INK} strokeWidth="1.5" />
          <ellipse cx="60" cy={y} rx="4.5" ry="3.6" fill="#fff" stroke={INK} strokeWidth="1.5" />
        </>
      )}
      <circle cx="40.6" cy={y} r={r} />
      {mood === 'wink' ? (
        <path d="M55.5 63.5 Q60 59.5 64.5 63.5" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      ) : (
        <circle cx="60.6" cy={y} r={r} />
      )}
      {mood === 'wow' && (
        <>
          <circle cx="41.6" cy={y - 1.1} r="0.9" fill="#fff" />
          <circle cx="61.6" cy={y - 1.1} r="0.9" fill="#fff" />
        </>
      )}
    </g>
  )
}

function Mouth({ mood, kid }: { mood: GuthMood; kid: boolean }) {
  if (kid) {
    switch (mood) {
      case 'talk':
        return <ellipse cx="50" cy="80.5" rx="5" ry="4" fill={MOUTH} stroke={INK} strokeWidth="1.8" />
      case 'wow':
        return <circle cx="50" cy="81" r="4.2" fill={MOUTH} stroke={INK} strokeWidth="1.8" />
      case 'sad':
        return <path d="M43 83 Q50 77 57 83" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      default:
        return <path d="M41.5 78 Q50 87 58.5 78 Q50 81 41.5 78 Z" fill={MOUTH} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
    }
  }
  switch (mood) {
    case 'talk':
      return <ellipse cx="50" cy="82.6" rx="3.6" ry="2.8" fill={MOUTH} stroke={INK} strokeWidth="1.5" />
    case 'wow':
      return <circle cx="50" cy="83.2" r="3.4" fill={MOUTH} stroke={INK} strokeWidth="1.5" />
    case 'sad':
      return <path d="M45 85 Q50 81.5 55 85" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    default:
      return <path d="M44.5 81 Q50 86.5 55.5 81" fill={MOUTH} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
  }
}
