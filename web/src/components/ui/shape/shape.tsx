import React from 'react'
import styled from 'styled-components'
import { BlockColor } from '../../block/color/color'
import { getColorFromPalette } from '../../block/color/utils'

const UiShapeWrapper = styled.div<{ color?: BlockColor }>`
  overflow: hidden;
  height: 2.2rem;
  margin-top: -2rem;
  position: relative;
  z-index: 5;
  color: ${(p) =>
    getColorFromPalette(p.color, p.theme, false, p.theme.color.gray1)};
`

const UiShapeSvg = styled.svg`
  fill: none;
  transform: scale(2);
  transform-origin: top center;
`

type UiShapeProps = {
  color?: BlockColor
  className?: string
}

const UiShape: React.FC<UiShapeProps> = ({ color, className }) => (
  <UiShapeWrapper color={color} className={className}>
    <UiShapeSvg viewBox='0 0 2880 48' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M0 48h2880V0h-720C1442.5 52 720 0 720 0H0v48z'
        fill='currentColor'
      />
    </UiShapeSvg>
  </UiShapeWrapper>
)

export default UiShape
