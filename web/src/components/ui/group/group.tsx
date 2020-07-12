import styled from 'styled-components'
import { getColorFromPalette } from '../../block/color/utils'
import { BlockColorPalette } from '../../block/color/color'
import { createUiComponent } from '../utils'

const UiGroup = styled.div<BlockColorPalette>`
  background: ${(p) => getColorFromPalette(p.backgroundColor, p.theme)};
  color: ${(p) => getColorFromPalette(p.textColor, p.theme)};
  overflow: hidden;
`

export default createUiComponent(UiGroup, {})
