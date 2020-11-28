import React from 'react'
import styled from 'styled-components'
import { BlockColor } from '../../block/color/color'
import { getColorFromPalette } from '../../block/color/utils'

const UiShapeWrapper = styled.div<{ color?: BlockColor }>`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
  text-align: right;
  color: ${(p) =>
    getColorFromPalette(p.color, p.theme, false, p.theme.color.gray1)};
`

const UiShapeSvg = styled.svg`
  fill: none;
  transform: scale(2);
  transform-origin: left center;
  height: 100%;
  width: auto;
`

type UiShapeVerticalProps = {
  color?: BlockColor
  className?: string
}

const UiShapeVertical: React.FC<UiShapeVerticalProps> = ({
  color,
  className
}) => (
  <UiShapeWrapper color={color} className={className}>
    <UiShapeSvg viewBox='0 0 112 690' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M116 0H51v172C76 384 0 517 0 517v173h116V0z'
        fill='currentColor'
      />
    </UiShapeSvg>
  </UiShapeWrapper>
)

export default UiShapeVertical
