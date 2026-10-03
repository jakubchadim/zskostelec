import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { accentAt } from '@/components/ui/accent'
import { Reveal } from '@/components/ui/reveal'

export type Step = {
  icon: LucideIcon
  title: string
  text: ReactNode
  /** Small chip above the title - who / when ("8.–9. třída", "s vaším souhlasem"). */
  tag?: string
}

/**
 * A numbered "how it goes" path: one sticker per step with a big number
 * badge, joined by a dashed line (vertical on phones, a wrapping grid on
 * wider screens where the numbers carry the order).
 */
export function StepPath({
  steps,
  className,
  columns = 3
}: {
  steps: Step[]
  className?: string
  columns?: 3 | 4 | 5
}) {
  return (
    <ol
      className={cn(
        'relative m-0 grid list-none gap-5 p-0 sm:grid-cols-2 sm:gap-y-10 sm:pt-5 md:grid-cols-3',
        columns === 3 && 'lg:grid-cols-3',
        columns === 4 && 'lg:grid-cols-4',
        columns === 5 && 'lg:grid-cols-5',
        // Dashed "path" behind the cards on phones.
        'before:absolute before:top-6 before:bottom-6 before:left-6 before:border-l-[3px] before:border-dashed before:border-ink/25 sm:before:hidden',
        className
      )}
    >
      {steps.map((step, idx) => {
        const accent = accentAt(idx)
        const Icon = step.icon
        const darkText = accent.name === 'sun' || accent.name === 'tangerine'
        return (
          <li key={step.title} className="relative pl-16 sm:pl-0">
            <Reveal delay={idx * 70} className="h-full">
              <span
                aria-hidden
                className={cn(
                  'absolute top-0 left-0 z-10 grid size-12 place-items-center rounded-full border-[2.5px] border-ink font-display text-xl font-extrabold shadow-pop-sm sm:-top-5 sm:left-4',
                  accent.bg,
                  darkText ? 'text-ink' : 'text-white-1'
                )}
              >
                {idx + 1}
              </span>
              <article className={cn('sticker flex h-full flex-col gap-2 p-5 sm:pt-10', accent.tint)}>
                <div className="flex items-center gap-2">
                  <Icon className={cn('size-5 shrink-0', accent.text)} aria-hidden />
                  {step.tag && (
                    <span className={cn('rounded-full bg-paper px-2.5 py-0.5 text-xs font-extrabold', accent.text)}>
                      {step.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-lg leading-tight">
                  <span className="sr-only">{idx + 1}. </span>
                  {step.title}
                </h3>
                <p className="m-0 text-gray-8">{step.text}</p>
              </article>
            </Reveal>
          </li>
        )
      })}
    </ol>
  )
}
