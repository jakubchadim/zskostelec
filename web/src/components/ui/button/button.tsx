import styled from 'styled-components'
import { rgba } from 'polished'
import { createUiComponent } from '../utils'
import { getColorFromPalette } from '../../block/color/utils'
import { BlockColorPalette } from '../../block/color/color'
import { BlockCoreButtonType } from '../../block/core/button/constants'

type UiButtonProps = BlockColorPalette & {
  themeType?: BlockCoreButtonType
  minWidth?: number
  disabled?: boolean
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
  border-radius: ${(p) => p.theme.radius.small};
  min-width: ${(p) => (p.minWidth == null ? '6em' : `${p.minWidth}em`)};
  text-align: center;
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  line-height: 1.2;
`

export default createUiComponent(UiButton, {})
