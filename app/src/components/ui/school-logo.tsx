import { useId, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/** Hat tip on hover/focus. Shared by the hat and the clip that uncovers the head under it. */
const HAT_MOTION =
  'transition-transform duration-300 ease-out group-hover:-translate-y-[9px] group-hover:-rotate-12 group-focus-visible:-translate-y-[9px] group-focus-visible:-rotate-12 motion-reduce:transition-none'
/** Pivot at the left end of the brim, in viewBox units, so hat and clip turn around the same point. */
const HAT_PIVOT: CSSProperties = { transformBox: 'view-box', transformOrigin: '13px 53px' }

/**
 * The school mark (logo A1 from design/logo): Jiří Stanislav Guth-Jarkovský
 * after the memorial plaque in Kostelec - hat, round glasses, upturned
 * moustache and bow tie. Inline (not an <img>) so the hat can be tipped in
 * greeting when a parent `group` is hovered or focused.
 */
export function SchoolMark({ className, outline }: { className?: string; outline?: string }) {
  const revealId = `hat-reveal-${useId().replace(/:/g, '')}`

  return (
    <svg viewBox="0 0 100 100" overflow="visible" aria-hidden focusable={false} className={cn('block', className)}>
      {/* Outline drawn in the SVG itself (not a CSS border) so it follows the rounded square exactly. */}
      <rect
        x="1.5"
        y="1.5"
        width="97"
        height="97"
        rx="25"
        fill="#ff8a00"
        stroke={outline}
        strokeWidth={outline ? 2.5 : 0}
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="27.5" cy="63" r="5.5" fill="#ffd9b0" />
      <circle cx="72.5" cy="63" r="5.5" fill="#ffd9b0" />
      {/* Bald crown (1937 portrait): drawn as wide as the face so it joins it seamlessly,
          and revealed by a clip that moves exactly like the hat brim - only the strip the
          tipped hat uncovers ever shows. */}
      <defs>
        <clipPath id={revealId}>
          <rect x="-20" y="50" width="140" height="60" className={HAT_MOTION} style={HAT_PIVOT} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${revealId})`}>
        <path d="M28 52 C28 30 38 22 50 22 C62 22 72 30 72 52 Z" fill="#ffd9b0" />
      </g>
      <path d="M28 50 C27 77 37 90 50 90 C63 90 73 77 72 50 Z" fill="#ffd9b0" />
      <path d="M50 64 C46.5 70 47 73.5 50 73.5 C53 73.5 53.5 70 50 64 Z" fill="#f2b98c" />
      <path d="M31.5 61.5 L28 60 M68.5 61.5 L72 60" stroke="#1d2150" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="40" cy="62" r="8.5" fill="#fff9f0" stroke="#1d2150" strokeWidth="3.6" />
      <circle cx="60" cy="62" r="8.5" fill="#fff9f0" stroke="#1d2150" strokeWidth="3.6" />
      <path d="M48 61 Q50 59 52 61" fill="none" stroke="#1d2150" strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M50 74.5 C46 71 38 70.5 33 74 C30.5 75.8 28.2 74.6 27 69.5 C25.8 77 30 80.5 36.5 79.5 C42 78.7 46 77.6 50 77.6 C54 77.6 58 78.7 63.5 79.5 C70 80.5 74.2 77 73 69.5 C71.8 74.6 69.5 75.8 67 74 C62 70.5 54 71 50 74.5 Z"
        fill="#f4f1ea"
        stroke="#1d2150"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M50 92 L41 87.5 L41 96.5 Z M50 92 L59 87.5 L59 96.5 Z"
        fill="#ffcf33"
        stroke="#1d2150"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="92" r="2.4" fill="#1d2150" />
      {/* Hat - tips up and back on hover (a gentleman's greeting). */}
      <g className={HAT_MOTION} style={HAT_PIVOT}>
        <path d="M32 46 L34 21 Q35 17 40 17 H60 Q65 17 66 21 L68 46 Z" fill="#1d2150" />
        <path d="M41 21 Q50 25 59 21" fill="none" stroke="#3d4277" strokeWidth="2" strokeLinecap="round" />
        <rect x="33" y="36" width="34" height="6" fill="#ffcf33" />
        <path d="M13 47 Q50 39 87 47 Q89 52 83 53.5 Q50 47 17 53.5 Q11 52 13 47 Z" fill="#1d2150" />
      </g>
    </svg>
  )
}

type SchoolLogoProps = {
  /** Smaller variant (scrolled header, mobile menu). */
  compact?: boolean
  /** Light text for dark backgrounds (footer). */
  inverted?: boolean
  className?: string
}

/** Mark + full school name: "Základní škola / Gutha-Jarkovského / Kostelec nad Orlicí". */
export function SchoolLogo({ compact, inverted, className }: SchoolLogoProps) {
  return (
    <span className={cn('flex items-center gap-3 nav:gap-2.5 lg:gap-3', className)}>
      <SchoolMark
        outline={inverted ? '#ffffff' : '#1d2150'}
        className={cn(
          'shrink-0 transition-transform duration-300 group-hover:-rotate-3',
          // drop-shadow follows the drawn shape exactly (a box-shadow would have its own corner radius).
          !inverted && '[filter:drop-shadow(2px_2px_0_#1d2150)]',
          compact ? 'size-11' : 'size-12 md:size-14 nav:size-12 lg:size-14'
        )}
      />
      <span className="min-w-0 leading-none">
        <span
          className={cn(
            'block text-[0.66rem] font-extrabold tracking-[0.16em] uppercase',
            inverted ? 'text-sun' : 'text-primary-3'
          )}
        >
          Základní škola
        </span>
        <span
          className={cn(
            'block font-display leading-[1.05] font-extrabold tracking-tight whitespace-nowrap',
            compact ? 'text-lg' : 'text-lg xs:text-xl nav:text-[1.1rem] lg:text-[1.55rem]'
          )}
        >
          Gutha-Jarkovského
        </span>
        <span className={cn('block text-xs font-bold', inverted ? 'text-white-1/70' : 'text-gray-7')}>
          Kostelec nad Orlicí
        </span>
      </span>
    </span>
  )
}
