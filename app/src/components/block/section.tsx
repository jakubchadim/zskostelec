import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { BlockColorPalette } from './color/color'
import { getBackgroundColorClass, getTextColorClass } from './color/utils'

type SectionWaveProps = Pick<BlockColorPalette, 'backgroundColor'>

/**
 * Decorative wave divider between color-runs, ported from legacy `UiShape`
 * (`web/src/components/ui/shape/shape.tsx`). Self-contained (no dependency
 * on `footer/wave-divider.tsx`, which belongs to another task) - first thing
 * to cut if this polish isn't wanted.
 *
 * Pixel conversions from the legacy 10px-root rem values: height 2.2rem =
 * 22px real (no clean 5px-unit match, kept as an arbitrary value);
 * margin-top -2rem = -20px real = `-mt-4` (4 x 5px). Falls back to
 * `text-gray-1` (legacy's `theme.color.gray1` fallback) when no
 * `backgroundColor` is set.
 */
function SectionWave({ backgroundColor }: SectionWaveProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative z-[5] -mt-4 h-[22px] overflow-hidden',
        getTextColorClass(backgroundColor) || 'text-gray-1'
      )}
    >
      <svg viewBox="0 0 2880 48" className="origin-top scale-200" style={{ fill: 'none' }}>
        <path d="M0 48h2880V0h-720C1442.5 52 720 0 720 0H0v48z" fill="currentColor" />
      </svg>
    </div>
  )
}

type SectionProps = BlockColorPalette & {
  children: ReactNode
}

/**
 * One color-run of block content, ported from legacy `UiSection`
 * (`web/src/components/ui/section/section.tsx`). Padding matches
 * `theme.spacing(8/10/12, 0)` exactly - see the T3 plan's spacing table
 * (legacy `spacing(n)` = `n x 5px`, this app's `--spacing` unit).
 */
export function Section({ backgroundColor, textColor, children }: SectionProps) {
  return (
    <>
      <SectionWave backgroundColor={backgroundColor} />
      <section className={cn('py-8 sm:py-10 md:py-12', getBackgroundColorClass(backgroundColor), getTextColorClass(textColor))}>
        {children}
      </section>
    </>
  )
}
