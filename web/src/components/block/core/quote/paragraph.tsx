import React from 'react'
import styled, { css } from 'styled-components'
import { QuoteAltLeft } from '@styled-icons/boxicons-solid/QuoteAltLeft'
import { QuoteAltRight } from '@styled-icons/boxicons-solid/QuoteAltRight'
import { BlockFC } from '../../types'
import Content from '../../../content/content'
import UiContainer from '../../../ui/container/container'

const BlockQuote = styled.div`
  margin: ${(p) => p.theme.spacing(2, 0)};
  color: #363492;

  blockquote {
    font-size: 2.2rem;
    font-family: cursive;
    margin: 0;
  }
`

const BlockQuoteInner = styled.div`
  position: relative;

  ${(p) => p.theme.media.xs.up} {
    display: inline-block;
    padding: ${(p) => p.theme.spacing(0, 10)};
  }

  ${(p) => p.theme.media.sm.up} {
    padding: ${(p) => p.theme.spacing(0, 14)};
  }
`

const Quote__top = css`
  top: 0;
  left: 0;
`

const Quote__bottom = css`
  bottom: 0;
  right: 0;
`

const Quote = styled.div<{ bottom?: boolean }>`
  display: none;
  ${(p) => (p.bottom ? Quote__bottom : Quote__top)};

  ${(p) => p.theme.media.xs.up} {
    display: block;
    position: absolute;
    width: 4rem;
  }

  ${(p) => p.theme.media.sm.up} {
    width: 6rem;
  }
`

type BlockCoreQuoteAttrs = {
  align: string
}

const BlockCoreQuote: BlockFC<BlockCoreQuoteAttrs> = ({ block, nested }) => {
  const quote = (
    <BlockQuote>
      <BlockQuoteInner>
        <Quote as={QuoteAltLeft} />
        <Content content={block.content} />
        <Quote as={QuoteAltRight} bottom />
      </BlockQuoteInner>
    </BlockQuote>
  )

  return nested ? quote : <UiContainer>{quote}</UiContainer>
}
export default BlockCoreQuote
