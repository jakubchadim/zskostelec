import React from 'react'
import styled, { css } from 'styled-components'
import { RawHTML } from '../../../../types'
import { BlockColor } from '../../color/color'
import { BlockFC } from '../../types'
import UiContainer from '../../../ui/container/container'
import UiBox from '../../../ui/box/box'
import Content from '../../../content/content'

const BlockTable__base = css`
  & > table {
    td,
    th {
      border-bottom: 1px solid ${(p) => p.theme.color.gray2};
    }
  }
`

const BlockTable__stripes = css`
  & > table {
    tr {
      border-bottom: 1px solid ${(p) => p.theme.color.gray2};
    }

    tbody {
      tr:nth-child(odd) {
        background: ${(p) => p.theme.color.gray2};
      }
    }
  }
`

const BlockTable__fixed = css`
  & > table {
    table-layout: fixed;
  }
`

const BlockTable = styled.figure<{ stripes?: boolean; fixed?: boolean }>`
  margin: 0;
  overflow-x: auto;

  & > table {
    width: 100%;
    border-collapse: collapse;

    thead {
      text-align: left;
      font-size: 1.1em;
    }

    td,
    th {
      padding: ${(p) => p.theme.spacing(4)};
    }
  }

  ${(p) => (p.stripes ? BlockTable__stripes : BlockTable__base)};
  ${(p) => p.fixed && BlockTable__fixed};
`

const BlockTableOuter = styled.div`
  display: inline-block;
  max-width: 100%;
`

const BlockTableFig = styled.figcaption`
  text-align: center;
  font-size: 1.2rem;
  color: ${(p) => p.theme.color.gray6};
  padding: ${(p) => p.theme.spacing(2)};
`

type BlockCoreTableAttrs = {
  hasFixedLayout?: boolean
  stripes?: boolean
  fig?: RawHTML
}

const BlockCoreTable: BlockFC<BlockCoreTableAttrs> = ({ block, nested }) => {
  const table = (
    <BlockTableOuter>
      <UiBox backgroundColor={BlockColor.WHITE} offsetTop offsetBottom>
        <BlockTable
          stripes={block.attrs.stripes}
          fixed={block.attrs.hasFixedLayout}
        >
          <Content content={block.content} />
          {block.attrs.fig != null && (
            <BlockTableFig>
              <Content content={block.attrs.fig} />
            </BlockTableFig>
          )}
        </BlockTable>
      </UiBox>
    </BlockTableOuter>
  )

  return nested ? table : <UiContainer>{table}</UiContainer>
}

export default BlockCoreTable
