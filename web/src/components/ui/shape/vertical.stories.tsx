import { select } from '@storybook/addon-knobs'
import React from 'react'
import styled from 'styled-components'
import { BlockColor } from '../../block/color/color'
import { getColorFromPalette } from '../../block/color/utils'
import UiShapeVertical from './vertical'

const Block = styled.div<{ color: BlockColor }>`
  height: 10rem;
  background: ${(p) =>
    getColorFromPalette(p.color, p.theme, false, p.theme.color.gray1)};
`

const Box = styled.div`
  position: relative;
  height: 10rem;
  width: 12rem;
  background: ${(p) => p.theme.color.gray5};
`

export default {
  title: 'Ui'
}

export const ShapeVertical = () => {
  const color = select('Color', BlockColor, BlockColor.MEDIUM_GRAY)
  return (
    <>
      <Block color={color}>
        <Box>
          <UiShapeVertical color={color} />
        </Box>
      </Block>
      <Block color={color}>
        <Box>
          <UiShapeVertical color={color} />
        </Box>
      </Block>
      <Block color={color}>
        <Box>
          <UiShapeVertical color={color} />
        </Box>
      </Block>
    </>
  )
}
