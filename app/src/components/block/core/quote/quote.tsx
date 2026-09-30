import { Quote } from 'lucide-react'
import { BlockContainer as Container } from '../../block-container'
import { Content } from '../../html-content'
import type { BlockFC } from '../../types'

/** Gutenberg quote as a lilac speech card with a round quote-mark badge. */
export const BlockCoreQuote: BlockFC = ({ block, nested }) => {
  const quote = (
    <figure className="relative my-8 rounded-[1.75rem] border-[2.5px] border-ink bg-grape-tint px-6 pt-10 pb-6 shadow-pop sm:px-10">
      <span className="absolute -top-6 left-6 grid size-12 place-items-center rounded-full border-[2.5px] border-ink bg-grape text-white-1">
        <Quote aria-hidden className="size-6 fill-current" />
      </span>
      <blockquote className="m-0 font-display text-xl leading-snug font-semibold text-ink sm:text-2xl [&_p]:mb-2 [&_cite]:mt-3 [&_cite]:block [&_cite]:font-sans [&_cite]:text-base [&_cite]:font-bold [&_cite]:not-italic [&_cite]:text-gray-7">
        <Content content={block.content} />
      </blockquote>
    </figure>
  )

  return nested ? quote : <Container>{quote}</Container>
}
