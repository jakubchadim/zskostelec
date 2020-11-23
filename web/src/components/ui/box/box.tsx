import styled from 'styled-components'
import { BlockColorPalette } from '../../block/color/color'
import { getColorFromPalette } from '../../block/color/utils'
import { createUiComponent } from '../utils'

type UiBoxProps = BlockColorPalette & {
  offsetTop?: boolean
}

const UiBox = styled.div<UiBoxProps>`
  background: ${(p) =>
    getColorFromPalette(
      p.backgroundColor,
      p.theme,
      false,
      p.theme.color.white1
    )};
  color: ${(p) =>
    getColorFromPalette(p.textColor, p.theme, false, p.theme.color.black1)};
  box-shadow: ${(p) => p.theme.shadow.lift};
  border-radius: ${(p) => p.theme.radius.medium};
  margin-top: ${(p) => (p.offsetTop ? p.theme.spacing(2) : undefined)};
`

const Header = styled.div`
  padding: ${(p) => p.theme.spacing(5, 6, 0)};
  margin-bottom: ${(p) => p.theme.spacing(4)};
`

const Content = styled.div`
  padding: ${(p) => p.theme.spacing(5, 6)};

  ${Header} + & {
    padding-top: ${(p) => p.theme.spacing(0)};
  }

  p:last-child {
    margin-bottom: 0;
  }
`

export default createUiComponent(UiBox, {
  Header,
  Content
})
