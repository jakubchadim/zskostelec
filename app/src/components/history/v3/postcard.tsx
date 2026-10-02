import Image from 'next/image'
import type { Photo } from '../story'
import { cn } from '@/lib/utils'
import s from './trail.module.css'

const INK = '#1d2150'

/**
 * An archival photo dressed up as an old "Pozdrav z Kostelce" postcard:
 * cream card, sepia print, a perforated postage stamp and a postmark
 * with the year of the stop.
 */
export function Postcard({ photo, year, tilt = 0, className }: { photo: Photo; year: string; tilt?: number; className?: string }) {
  const portrait = photo.src.includes('portret')
  // CC BY-SA photos must stay recognisable: no sepia, and the crop is noted in the credit.
  const licensed = Boolean(photo.credit)
  return (
    <figure className={cn('relative m-0', s.postcard, className)} style={{ rotate: `${tilt}deg` }}>
      <div className="relative rounded-[6px] border-[2.5px] border-ink bg-[#fffaf0] p-2 shadow-pop sm:p-2.5">
        <div className="relative overflow-hidden rounded-[3px] border border-ink/25">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={portrait ? 818 : 1280}
            height={portrait ? 1087 : 807}
            sizes="(min-width: 882px) 440px, 92vw"
            className={cn('block aspect-[636/401] h-auto w-full object-cover', portrait && 'object-[50%_18%]', !licensed && s.sepia)}
          />
          <span aria-hidden className={s.greeting}>
            Pozdrav z Kostelce!
          </span>
        </div>
        <PostageStamp className="absolute -top-4 -right-3 w-12 rotate-[7deg] sm:w-14" />
        <Postmark year={year} className="absolute -top-3 right-8 w-[4.4rem] -rotate-12 sm:right-10 sm:w-20" />
        <figcaption className="px-1 pt-2 pb-0.5 text-[0.95rem] leading-snug text-gray-8 italic">
          {photo.caption}
          {licensed && <span className="mt-1 block text-xs text-gray-7 not-italic">{photo.credit} (oříznuto)</span>}
        </figcaption>
      </div>
    </figure>
  )
}

function PostageStamp({ className }: { className?: string }) {
  // Perforation: paper-coloured bites around the edge.
  const bites: [number, number][] = []
  for (let x = 2; x <= 50; x += 6) {
    bites.push([x, 0], [x, 62])
  }
  for (let y = 6; y <= 56; y += 6) {
    bites.push([0, y], [52, y])
  }
  return (
    <svg viewBox="-3 -3 58 68" aria-hidden focusable={false} className={cn('block drop-shadow-[2px_2px_0_rgba(29,33,80,0.6)]', className)}>
      <rect x="0" y="0" width="52" height="62" fill="#fff" />
      {bites.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill="#fffaf0" />
      ))}
      <rect x="5" y="5" width="42" height="52" fill="#ffe0ea" stroke={INK} strokeWidth="1.5" />
      {/* tiny landscape: hills + church */}
      <path d="M5 46 Q18 36 28 42 T47 38 V57 H5 Z" fill="#2fbf71" stroke={INK} strokeWidth="1.2" />
      <path d="M22 44 V30 L26 22 L30 30 V44 Z" fill="#fff9f0" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="38" cy="16" r="5" fill="#ffcf33" stroke={INK} strokeWidth="1.2" />
      <text x="10" y="18" fontSize="9" fontWeight="800" fill={INK} fontFamily="var(--font-display)">
        5h
      </text>
    </svg>
  )
}

function Postmark({ year, className }: { year: string; className?: string }) {
  const size = year.length <= 4 ? 25 : year.length <= 7 ? 17 : 14
  return (
    <svg viewBox="0 0 160 120" aria-hidden focusable={false} overflow="visible" className={cn('pointer-events-none block', className)}>
      <g filter="url(#v3-ink)" opacity="0.78">
        {/* wavy cancellation lines */}
        {[44, 56, 68, 80].map((y) => (
          <path key={y} d={`M100 ${y} q10 -6 20 0 t20 0 t20 0`} fill="none" stroke={INK} strokeWidth="3" />
        ))}
        <circle cx="60" cy="60" r="55" fill="none" stroke={INK} strokeWidth="4" />
        <circle cx="60" cy="60" r="36" fill="none" stroke={INK} strokeWidth="2" />
        <text fill={INK} fontSize="12" fontWeight="800" fontFamily="var(--font-body)">
          <textPath href="#v3-ring" textLength="280" lengthAdjust="spacing">
            KOSTELEC NAD ORLICÍ ★ KOSTELEC ★
          </textPath>
        </text>
        <text x="60" y={60 + size * 0.35} textAnchor="middle" fill={INK} fontSize={size} fontWeight="800" fontFamily="var(--font-display)">
          {year}
        </text>
      </g>
    </svg>
  )
}
