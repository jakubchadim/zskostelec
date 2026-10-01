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
 * Gutenberg button as a chunky "sticker" pill (`btn` utility). Internal
 * relative hrefs render via `next/link`; external/absolute/`target=_blank`
 * hrefs render a plain `<a>`. Without an editor-picked colour it falls back
 * to the sunny yellow; the outline style becomes a paper-white pill.
 */
export const BlockCoreButton: BlockFC<BlockCoreButtonAttrs> = ({ block: { attrs, content } }) => {
  const isOutline = attrs.type === BlockCoreButtonType.OUTLINE
  const hasColor = attrs.backgroundColor != null

  const className = cn(
    'btn my-1 text-base no-underline',
    hasColor ? getBackgroundColorClass(attrs.backgroundColor) : 'bg-sun',
    hasColor ? getBackgroundHoverColorClass(attrs.backgroundColor) : undefined,
    attrs.textColor != null ? getTextColorClass(attrs.textColor) : 'text-ink',
    isOutline && !hasColor && 'bg-paper'
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
