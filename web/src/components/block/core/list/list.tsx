import React from 'react'
import styled from 'styled-components'
import { BlockFC } from '../../types'
import Content from '../../../content/content'
import UiContainer from '../../../ui/container/container'

const BlockList = styled.div`
  ul {
    padding-left: 1em;
    list-style: none;

    & > li {
      position: relative;
      line-height: 1.4;

      &:before {
        content: '';
        display: block;
        position: absolute;
        top: 0.35em;
        left: -1em;
        width: 0.5em;
        height: 0.5em;
        background: ${(p) => p.theme.color.secondary1};
      }
    }

    & > li + li {
      margin-top: 0.3em;
    }
  }

  ul ul {
    margin: 1rem 0;

    & > li {
      &:before {
        background: ${(p) => p.theme.color.primary1};
      }
    }
  }

  ul ul ul {
    & > li {
      &:before {
        background: ${(p) => p.theme.color.gray6};
      }
    }
  }
`

type BlockCoreGroupAttrs = {}

const BlockCoreList: BlockFC<BlockCoreGroupAttrs> = ({ block, nested }) => {
  const list = (
    <BlockList>
      <Content content={block.content} />
    </BlockList>
  )

  return nested ? list : <UiContainer>{list}</UiContainer>
}

export default BlockCoreList
