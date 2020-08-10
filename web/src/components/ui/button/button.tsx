import styled from 'styled-components'
import { rgba } from 'polished'
import { createUiComponent } from '../utils'
import { getColorFromPalette } from '../../block/color/utils'
import { BlockColorPalette } from '../../block/color/color'
import { BlockCoreButtonType } from '../../block/core/button/constants'

type UiButtonProps = BlockColorPalette & {
  themeType?: BlockCoreButtonType
}

const UiButton = styled.button<UiButtonProps>`
  background: ${(p) =>
    getColorFromPalette(
      p.backgroundColor,
      p.theme,
      false,
      rgba(p.theme.color.primary1, 0.1)
    )};
  color: ${(p) =>
    getColorFromPalette(p.textColor, p.theme, false, p.theme.color.primary1)};
  display: inline-block;
  border: ${(p) =>
    p.themeType === BlockCoreButtonType.OUTLINE
      ? `${p.theme.spacing(0.2)} solid`
      : 'none'};
  padding: ${(p) =>
    p.themeType === BlockCoreButtonType.OUTLINE
      ? p.theme.spacing(1.8, 2.8)
      : p.theme.spacing(2, 3)};
  font-size: ${(p) => p.theme.fontSize.text4};
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  border-radius: ${(p) => p.theme.radius.small};
  min-width: 6em;
  text-align: center;
`

export default createUiComponent(UiButton, {})
