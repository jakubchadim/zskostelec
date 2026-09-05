import { Quote } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Content } from '../../html-content'
import type { BlockFC } from '../../types'

/**
 * Ported from `web/src/components/block/core/quote/paragraph.tsx` (renamed
 * to match its folder - no behavior change). Decorative quote-mark icons:
 * legacy used styled-icons' `QuoteAltLeft`/`QuoteAltRight`; ported to
 * `lucide-react`'s single `Quote` icon, mirrored (`scale-x-[-1]`) for the
 * closing mark rather than sourcing an exact second glyph - same decorative
 * role, not a pixel-identical asset.
 *
 * Pixel conversions from the legacy 10px-root rem values: blockquote
 * font-size 2.2rem = 22px real; margin theme.spacing(2,0) = 10px 0;
 * container padding theme.spacing(0,10)/(0,14) = px-10/sm:px-14 (both clean
 * multiples of the 5px spacing unit); icon width 4rem/6rem = 40px/60px real
 * = w-8/sm:w-12 (both clean multiples of 5px).
 */
export const BlockCoreQuote: BlockFC = ({ block, nested }) => {
  const quote = (
    <div className="my-2 text-[#363492]">
      <div className="relative inline-block px-10 sm:px-14">
        <Quote aria-hidden className="absolute top-0 left-0 hidden w-8 sm:block sm:w-12" />
        <blockquote className="m-0 font-serif text-[22px] italic">
          <Content content={block.content} />
        </blockquote>
        <Quote aria-hidden className="absolute right-0 bottom-0 hidden w-8 scale-x-[-1] sm:block sm:w-12" />
      </div>
    </div>
  )

  return nested ? quote : <Container>{quote}</Container>
}
