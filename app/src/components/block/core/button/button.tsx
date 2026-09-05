import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { BlockColorPalette } from '../../color/color'
import { getBackgroundColorClass, getBackgroundHoverColorClass, getTextColorClass } from '../../color/utils'
import { Content } from '../../html-content'
import type { BlockFC } from '../../types'
import { BlockCoreButtonType } from './constants'

export type BlockCoreButtonAttrs = BlockColorPalette & {
  type?: BlockCoreButtonType
  href?: string | null
  target?: string | null
  rel?: string | null
}

/**
 * Ported from `web/src/components/block/core/button/button.tsx`. Internal
 * relative hrefs render via `next/link` (client-side transitions for
 * navigation, unlike in-prose links - see `html-content.tsx`'s doc comment);
 * external/absolute/`target=_blank` hrefs render a plain `<a>`, mirroring
 * legacy's gatsby-`Link`-vs-`<a>` branch exactly.
 *
 * No `attrs.backgroundColor`/`textColor` set (the common case - most
 * buttons don't have an explicit color pick) falls back to
 * `bg-primary-1/10`/`hover:bg-primary-2/10`/`text-primary-1`, matching
 * `app/src/app/not-found.tsx`'s existing button styling and legacy's
 * `rgba(primary1/2, 0.1)` fallback exactly (Tailwind's opacity-modifier
 * syntax gives us the same tint without a bespoke CSS var). Both fill and
 * outline variants get this background (legacy design: even "outline" is a
 * subtly-tinted chip, not a fully transparent border-only button) - only
 * the border/padding differ between the two.
 *
 * Pixel conversions (10px-root rem -> this app's 5px spacing unit): fill
 * padding `spacing(2,3)` = 10px/15px = `py-2 px-3` (clean multiples);
 * outline padding `spacing(1.8,2.8)` = 9px/14px and border `spacing(0.2)` =
 * 1px have no clean integer multiple, so both use arbitrary px brackets.
 */
export const BlockCoreButton: BlockFC<BlockCoreButtonAttrs> = ({ block: { attrs, content } }) => {
  const isOutline = attrs.type === BlockCoreButtonType.OUTLINE
  const hasColor = attrs.backgroundColor != null

  const className = cn(
    'inline-block min-w-[6em] rounded-small text-center text-4 leading-[1.2] font-medium no-underline',
    hasColor ? getBackgroundColorClass(attrs.backgroundColor) : 'bg-primary-1/10',
    hasColor ? getBackgroundHoverColorClass(attrs.backgroundColor) : 'hover:bg-primary-2/10',
    attrs.textColor != null ? getTextColorClass(attrs.textColor) : 'text-primary-1',
    isOutline ? 'border-[1px] border-current px-[14px] py-[9px]' : 'px-3 py-2'
  )

  const isExternal = !attrs.href || attrs.href.startsWith('http') || attrs.target === '_blank'

  if (isExternal) {
    return (
      <a href={attrs.href ?? undefined} target={attrs.target ?? undefined} rel={attrs.rel ?? undefined} className={className}>
        <Content content={content} />
      </a>
    )
  }

  return (
    <Link href={attrs.href ?? ''} target={attrs.target ?? undefined} className={className}>
      <Content content={content} />
    </Link>
  )
}
