import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { WaveEdge } from '@/components/ui/doodles'
import type { BlockColorPalette } from './color/color'
import { getBackgroundColorClass, getTextColorClass } from './color/utils'

type SectionProps = BlockColorPalette & {
  children: ReactNode
}

/**
 * One colour-run of block content (see `getBlockSections`). A run with an
 * explicit background from the editor gets a full-bleed band with a wavy
 * top edge; the default run just sits on the cream page. Content is set in
 * the `wp-prose` reading style.
 */
export function Section({ backgroundColor, textColor, children }: SectionProps) {
  const bg = getBackgroundColorClass(backgroundColor)

  return (
    <>
      {bg && <WaveEdge className={cn('-mb-px block h-6 w-full sm:h-10', getTextColorClass(backgroundColor))} />}
      <section
        className={cn(
          'wp-prose',
          bg ? 'py-8 sm:py-12' : 'py-6 sm:py-8',
          bg,
          getTextColorClass(textColor),
          // An editor-picked text colour applies to headings/links too.
          textColor && '[--prose-link:currentColor] [--prose-strong:currentColor]'
        )}
      >
        {children}
      </section>
    </>
  )
}
